import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection,
} from 'discord.js';
import { isSuperuser } from '../services/roleService.js';
import {
  buildWarningEmbed,
  buildSuccessEmbed,
  buildErrorEmbed,
} from '../utils/embed.js';

const execFileAsync = promisify(execFile);

const defaultIntervalMs = 5 * 60 * 1000; // 5 minutes

const normalizeBoolean = (value, fallback = false) => {
  if (typeof value !== 'string') {
    return fallback;
  }
  const lowered = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].includes(lowered)) {
    return true;
  }
  if (['0', 'false', 'no', 'n', 'off'].includes(lowered)) {
    return false;
  }
  return fallback;
};

const parseInterval = (value) => {
  if (!value) {
    return defaultIntervalMs;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return defaultIntervalMs;
  }
  return parsed;
};

const defaultRepositoryUrl = 'https://github.com/ArchieHarvey/Ascenders.git';

const rawRemote = process.env.GIT_AUTO_PULL_REMOTE?.trim();
const rawRepositoryUrl = process.env.GIT_AUTO_PULL_REPOSITORY_URL?.trim();

let repositoryUrl = rawRepositoryUrl || '';
let remoteName = '';

if (!repositoryUrl && rawRemote) {
  if (rawRemote.includes('://')) {
    repositoryUrl = rawRemote;
  } else {
    remoteName = rawRemote;
  }
}

if (!repositoryUrl && !remoteName) {
  repositoryUrl = defaultRepositoryUrl;
}

if (!repositoryUrl && !remoteName) {
  remoteName = 'origin';
}

const branch = process.env.GIT_AUTO_PULL_BRANCH?.trim() || 'main';
const usesRepositoryUrl = Boolean(repositoryUrl);
const pullTarget = usesRepositoryUrl ? repositoryUrl : remoteName;
const remoteTrackingBase = 'refs/remotes/git-auto-pull';
const trackingRef = usesRepositoryUrl
  ? `${remoteTrackingBase}/${branch}`
  : `${remoteName}/${branch}`;
const displayRef = usesRepositoryUrl
  ? `${repositoryUrl}#${branch}`
  : trackingRef;

const config = {
  enabled: normalizeBoolean(process.env.GIT_AUTO_PULL_ENABLED, false),
  channelId: process.env.GIT_AUTO_PULL_CHANNEL_ID?.trim() ?? '',
  repositoryUrl,
  remoteName,
  branch,
  intervalMs: parseInterval(process.env.GIT_AUTO_PULL_INTERVAL_MS),
  workdir: process.env.GIT_AUTO_PULL_WORKDIR?.trim() || process.cwd(),
  usesRepositoryUrl,
  pullTarget,
  trackingRef,
  displayRef,
  logChecks: normalizeBoolean(
    process.env.GIT_AUTO_PULL_LOG_CHECKS,
    true,
  ),
};

const buttonPrefix = 'git-auto-pull';
const restartDelayMs = 0;

const generateToken = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

let restartTimer = null;

const scheduleRestart = () => {
  if (restartTimer) {
    return restartDelayMs;
  }

  console.log(`${logPrefix} Crashing process to trigger restart.`);

  restartTimer = setImmediate(() => {
    process.exit(1);
  });

  return restartDelayMs;
};

const state = {
  initialized: false,
  pendingUpdate: null,
  lastCheckAt: null,
  lastPullAt: null,
  lastError: null,
  isChecking: false,
  isPulling: false,
  lastTopic: null,
  originalTopic: null,
};

let clientHandle = null;
let intervalHandle = null;
let channelCache = null;
let messageCache = new Collection();

const logPrefix = '[GitAutoPull]';
const IST_OFFSET_MINUTES = 5 * 60 + 30; // UTC+05:30
const topicMarker = 'Git auto-pull |';

const formatRelativeTimestamp = (value, fallback = 'Never') => {
  if (!value) {
    return fallback;
  }
  return `<t:${Math.floor(value / 1000)}:R>`;
};

const pad = (value) => value.toString().padStart(2, '0');

const formatTopicTimestamp = (value) => {
  if (!value) {
    return 'Never';
  }
  const istTime = value + IST_OFFSET_MINUTES * 60 * 1000;
  const date = new Date(istTime);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate(),
  )} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} IST`;
};

const buildChannelTopic = () => {
  const base = state.originalTopic?.trim();
  const status = `${topicMarker}Last check: ${formatTopicTimestamp(
    state.lastCheckAt,
  )} | Last pull: ${formatTopicTimestamp(state.lastPullAt)}`;
  if (!base) {
    return status;
  }
  return `${base} | ${status}`;
};

const updateChannelTopic = async () => {
  const channel = await ensureChannel();
  if (!channel || typeof channel.setTopic !== 'function') {
    return;
  }

  const topic = buildChannelTopic();
  const trimmedTopic = topic.length > 1024 ? topic.slice(0, 1024) : topic;

  if (state.lastTopic === trimmedTopic) {
    return;
  }

  try {
    await channel.setTopic(trimmedTopic);
    state.lastTopic = trimmedTopic;
  } catch (error) {
    console.error(
      `${logPrefix} Failed to update channel topic for ${channel.id}:`,
      error,
    );
  }
};

const parseButtonCustomId = (customId) => {
  if (typeof customId !== 'string') {
    return null;
  }
  const segments = customId.split(':');
  if (segments.length !== 3) {
    return null;
  }

  const [prefix, action, token] = segments;
  if (prefix !== buttonPrefix || !action || !token) {
    return null;
  }

  return { action, token };
};

const isGitAutoPullCustomId = (customId) =>
  Boolean(parseButtonCustomId(customId));

const buildButtonRow = (token) =>
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`${buttonPrefix}:confirm:${token}`)
      .setLabel('Pull updates')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`${buttonPrefix}:cancel:${token}`)
      .setLabel('Dismiss')
      .setStyle(ButtonStyle.Secondary),
  );

const disablePendingButtons = async (pendingSnapshot) => {
  if (!pendingSnapshot?.messageId) {
    return;
  }

  const message = await fetchMessage(pendingSnapshot);
  if (!message?.editable || !message.components?.length) {
    return;
  }

  try {
    await message.edit({ components: [] });
  } catch (error) {
    console.warn(
      `${logPrefix} Failed to disable buttons for message ${pendingSnapshot.messageId}:`,
      error,
    );
  }
};

const execGit = async (args) => {
  try {
    const { stdout, stderr } = await execFileAsync('git', args, {
      cwd: config.workdir,
      windowsHide: true,
    });
    return {
      stdout: stdout?.toString() ?? '',
      stderr: stderr?.toString() ?? '',
    };
  } catch (error) {
    const stdout = error?.stdout?.toString?.() ?? '';
    const stderr = error?.stderr?.toString?.() ?? '';
    const wrapped = new Error(
      `${logPrefix} git ${args.join(' ')} failed: ${error.message}`,
    );
    wrapped.stdout = stdout;
    wrapped.stderr = stderr;
    throw wrapped;
  }
};

const runGit = async (args) => {
  const { stdout } = await execGit(args);
  return stdout.trim();
};

const ensureChannel = async () => {
  if (!clientHandle) {
    return null;
  }

  if (!config.channelId) {
    console.warn(
      `${logPrefix} GIT_AUTO_PULL_CHANNEL_ID is not configured. Notifications are disabled.`,
    );
    return null;
  }

  if (channelCache) {
    return channelCache;
  }

  try {
    const channel = await clientHandle.channels.fetch(config.channelId);
    if (!channel?.isTextBased?.()) {
      console.warn(
        `${logPrefix} Channel ${config.channelId} is not text-based. Disabling git auto-pull notifications.`,
      );
      return null;
    }
    if (state.originalTopic === null && typeof channel.topic === 'string') {
      const currentTopic = channel.topic ?? '';
      const markerIndex = currentTopic.indexOf(topicMarker);
      state.originalTopic =
        markerIndex >= 0
          ? currentTopic.slice(0, markerIndex).trim()
          : currentTopic.trim();
      state.lastTopic = currentTopic.trim();
    }
    channelCache = channel;
    return channelCache;
  } catch (error) {
    console.error(
      `${logPrefix} Failed to resolve channel ${config.channelId}:`,
      error,
    );
    return null;
  }
};

const parseCommits = (logOutput) =>
  logOutput
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [hash, ...rest] = line.split(' ');
      return {
        hash,
        message: rest.join(' '),
      };
    });

const buildNotificationEmbed = ({ aheadCount, commits, refLabel }) =>
  buildWarningEmbed({
    title: 'Git updates available',
    description: `Detected **${aheadCount}** new commit(s) on \`${refLabel}\`.`,
    fields: commits.length
      ? [
          {
            name: 'Latest commits',
            value: commits
              .slice(0, 5)
              .map((entry) => `\`${entry.hash}\` ${entry.message}`)
              .join('\n'),
          },
        ]
      : [],
  });

const buildConfirmationEmbed = ({
  actorTag,
  result,
  refLabel,
  lastCheckAt,
  lastPullAt,
}) => {
  const outputLines = [];
  if (result.stdout) {
    outputLines.push(result.stdout.trim());
  }
  if (result.stderr) {
    outputLines.push(result.stderr.trim());
  }
  const outputSnippet = outputLines.join('\n').trim();

  return buildSuccessEmbed({
    title: 'Git pull completed',
    description: `Pull confirmed by **${actorTag ?? 'Unknown'}**.`,
    fields: [
      {
        name: 'Ref',
        value: `\`${refLabel}\``,
      },
      {
        name: 'Last check',
        value: formatRelativeTimestamp(lastCheckAt, 'Unknown'),
        inline: true,
      },
      {
        name: 'Last pull',
        value: formatRelativeTimestamp(lastPullAt),
        inline: true,
      },
      ...(outputSnippet
        ? [
            {
              name: 'git pull output',
              value:
                outputSnippet.length > 1000
                  ? `\`\`\`\n${outputSnippet.slice(0, 1000)}...\n\`\`\``
                  : `\`\`\`\n${outputSnippet}\n\`\`\``,
            },
          ]
        : []),
    ],
  });
};

const rememberMessage = (message) => {
  if (!message) {
    return;
  }
  messageCache.set(message.id, message);
  // Trim cache to avoid unbounded growth
  if (messageCache.size > 25) {
    const [firstKey] = messageCache.keys();
    messageCache.delete(firstKey);
  }
};

const fetchMessage = async ({ channelId, messageId }) => {
  if (!channelId || !messageId) {
    return null;
  }
  const cached = messageCache.get(messageId);
  if (cached) {
    return cached;
  }
  const channel = await ensureChannel();
  if (!channel || channel.id !== channelId) {
    return null;
  }
  try {
    const message = await channel.messages.fetch(messageId);
    rememberMessage(message);
    return message;
  } catch (error) {
    console.warn(`${logPrefix} Unable to fetch notification message:`, error);
    return null;
  }
};

const notifyPendingUpdate = async ({ aheadCount, commits, token }) => {
  const channel = await ensureChannel();
  if (!channel) {
    return { token };
  }

  try {
    const message = await channel.send({
      embeds: [
        buildNotificationEmbed({
          aheadCount,
          commits,
          refLabel: config.displayRef,
        }),
      ],
      components: [buildButtonRow(token)],
    });

    rememberMessage(message);
    return { channelId: message.channel.id, messageId: message.id, token };
  } catch (error) {
    console.error(
      `${logPrefix} Failed to post update notification to channel ${channel.id}:`,
      error,
    );
    return { token };
  }
};

const updateStateWithPending = async ({ aheadCount, remoteHead, commits }) => {
  const existingHead = state.pendingUpdate?.remoteHead;
  const token = generateToken();

  if (state.pendingUpdate) {
    await disablePendingButtons(state.pendingUpdate);
  }

  const notificationMeta =
    (await notifyPendingUpdate({
      aheadCount,
      commits,
      token,
    })) ?? {};

  state.pendingUpdate = {
    remoteRef: config.displayRef,
    remoteHead,
    aheadCount,
    commits,
    lastCheckAt: state.lastCheckAt,
    lastPullAt: state.lastPullAt,
    notifiedAt: Date.now(),
    token: notificationMeta.token ?? token,
    ...notificationMeta,
  };

  if (existingHead && existingHead !== remoteHead) {
    console.log(
      `${logPrefix} Detected new remote head ${remoteHead} (previous ${existingHead}).`,
    );
  } else {
    console.log(
      `${logPrefix} Remote branch ${config.displayRef} is ahead by ${aheadCount} commit(s).`,
    );
  }
};

const markAsUpToDate = async () => {
  if (state.pendingUpdate) {
    await disablePendingButtons(state.pendingUpdate);
    console.log(
      `${logPrefix} Remote branch ${config.displayRef} is now up to date. Clearing pending state.`,
    );
  }
  state.pendingUpdate = null;
};

const fetchRemoteStatus = async () => {
  if (!config.pullTarget) {
    throw new Error(
      `${logPrefix} No remote target configured for git auto-pull.`,
    );
  }

  const fetchArgs = config.usesRepositoryUrl
    ? [
        'fetch',
        config.pullTarget,
        `${config.branch}:${config.trackingRef}`,
      ]
    : ['fetch', config.pullTarget, config.branch];

  await execGit(fetchArgs);

  const [aheadRaw, behindRaw] = await Promise.all([
    runGit(['rev-list', '--count', `HEAD..${config.trackingRef}`]),
    runGit(['rev-list', '--count', `${config.trackingRef}..HEAD`]),
  ]);

  const aheadCount = Number.parseInt(aheadRaw, 10) || 0;
  const behindCount = Number.parseInt(behindRaw, 10) || 0;

  const remoteHead = await runGit(['rev-parse', config.trackingRef]);

  let commits = [];
  if (aheadCount > 0) {
    const logOutput = await runGit([
      'log',
      '--oneline',
      '--decorate=no',
      `HEAD..${config.trackingRef}`,
    ]);
    commits = parseCommits(logOutput);
  }

  return {
    aheadCount,
    behindCount,
    remoteHead,
    remoteRef: config.displayRef,
    trackingRef: config.trackingRef,
    commits,
  };
};

const performCheck = async ({ source = 'scheduled', force = false } = {}) => {
  if (!config.enabled) {
    return null;
  }

  if (!force && (state.isChecking || state.isPulling)) {
    return null;
  }

  state.isChecking = true;
  try {
    if (config.logChecks) {
      console.log(`${logPrefix} Performing git check (${source}).`);
    }
    const status = await fetchRemoteStatus();
    state.lastCheckAt = Date.now();
    state.lastError = null;
    status.lastCheckAt = state.lastCheckAt;
    status.lastPullAt = state.lastPullAt;

    if (status.aheadCount > 0) {
      if (state.pendingUpdate?.remoteHead !== status.remoteHead || force) {
        await updateStateWithPending(status);
      }
    } else {
      await markAsUpToDate();
    }

    if (status.behindCount > 0) {
      console.warn(
        `${logPrefix} Local branch is ahead of remote (${config.displayRef}) by ${status.behindCount} commit(s).`,
      );
    }

    await updateChannelTopic();

    return status;
  } catch (error) {
    state.lastError = error;
    console.error(`${logPrefix} Failed to check git status (${source}):`, error);
    return null;
  } finally {
    state.isChecking = false;
  }
};

const startInterval = () => {
  if (intervalHandle || !config.enabled) {
    return;
  }

  intervalHandle = setInterval(() => {
    void performCheck({ source: 'interval' });
  }, config.intervalMs);
};

const announceOutcome = async ({ pendingSnapshot, embed }) => {
  const channel = await ensureChannel();
  if (!channel || !embed) {
    return;
  }

  if (pendingSnapshot?.messageId) {
    const message = await fetchMessage(pendingSnapshot);
    if (message) {
      await message.reply({ embeds: [embed] });
      return;
    }
  }

  await channel.send({ embeds: [embed] });
};

export const initializeGitAutoPull = async (client) => {
  clientHandle = client;

  if (!config.enabled) {
    console.log(
      `${logPrefix} Disabled (set GIT_AUTO_PULL_ENABLED=true to activate).`,
    );
    return;
  }

  if (state.initialized) {
    return;
  }

  state.initialized = true;

  console.log(
    `${logPrefix} Watching ${config.displayRef} every ${config.intervalMs}ms in ${
      config.workdir
    }.`,
  );

  await ensureChannel();
  await updateChannelTopic();
  await performCheck({ source: 'initial', force: true });
  startInterval();
};

export const getGitAutoPullStatus = () => {
  const pending = state.pendingUpdate
    ? {
        remoteRef: state.pendingUpdate.remoteRef,
        remoteHead: state.pendingUpdate.remoteHead,
        aheadCount: state.pendingUpdate.aheadCount,
        commits: state.pendingUpdate.commits?.slice?.(0, 10) ?? [],
        notifiedAt: state.pendingUpdate.notifiedAt,
        lastCheckAt: state.pendingUpdate.lastCheckAt,
        lastPullAt: state.pendingUpdate.lastPullAt,
        channelId: state.pendingUpdate.channelId,
        messageId: state.pendingUpdate.messageId,
      }
    : null;

  return {
    enabled: config.enabled,
    remoteName: config.remoteName || null,
    repositoryUrl: config.repositoryUrl || null,
    usesRepositoryUrl: config.usesRepositoryUrl,
    branch: config.branch,
    remoteRef: config.displayRef,
    trackingRef: config.trackingRef,
    channelId: config.channelId,
    intervalMs: config.intervalMs,
    workdir: config.workdir,
    pullTarget: config.pullTarget,
    initialized: state.initialized,
    isChecking: state.isChecking,
    isPulling: state.isPulling,
    lastCheckAt: state.lastCheckAt,
    lastPullAt: state.lastPullAt,
    lastError: state.lastError
      ? {
          message: state.lastError.message,
          stdout: state.lastError.stdout,
          stderr: state.lastError.stderr,
        }
      : null,
    pendingUpdate: pending,
  };
};

export const triggerManualGitCheck = async () =>
  performCheck({ source: 'manual', force: true });

export const confirmPendingGitUpdate = async ({ actorId, actorTag }) => {
  if (!config.enabled) {
    throw new Error('Git auto-pull is disabled.');
  }

  if (state.isPulling) {
    throw new Error('A git pull is already in progress.');
  }

  if (!state.pendingUpdate) {
    throw new Error('There is no pending git update to confirm.');
  }

  state.isPulling = true;

  const pendingSnapshot = state.pendingUpdate;
  try {
    if (!config.pullTarget) {
      throw new Error('No git remote configured.');
    }

    const result = await execGit(['pull', config.pullTarget, config.branch]);
    state.lastPullAt = Date.now();

    await disablePendingButtons(pendingSnapshot);
    state.pendingUpdate = null;
    await updateChannelTopic();
    await announceOutcome({
      pendingSnapshot,
      embed: buildConfirmationEmbed({
        actorTag,
        result,
        refLabel: config.displayRef,
        lastCheckAt: pendingSnapshot.lastCheckAt ?? state.lastCheckAt,
        lastPullAt: state.lastPullAt,
      }),
    });
    await performCheck({ source: 'post-pull', force: true });
    const scheduledRestartInMs = scheduleRestart();

    return {
      ...result,
      remoteRef: config.displayRef,
      remoteHead: pendingSnapshot.remoteHead,
      commits: pendingSnapshot.commits,
      actorId,
      actorTag,
      lastCheckAt: pendingSnapshot.lastCheckAt ?? state.lastCheckAt,
      lastPullAt: state.lastPullAt,
      scheduledRestartInMs,
    };
  } catch (error) {
    state.lastError = error;
    throw error;
  } finally {
    state.isPulling = false;
  }
};

export const cancelPendingGitUpdate = async ({ actorId, actorTag }) => {
  if (!state.pendingUpdate) {
    throw new Error('There is no pending git update to cancel.');
  }

  const pendingSnapshot = state.pendingUpdate;
  await disablePendingButtons(pendingSnapshot);
  state.pendingUpdate = null;

  await announceOutcome({
    pendingSnapshot,
    embed: buildSuccessEmbed({
      title: 'Git update dismissed',
      description: [
        `Update for \`${config.displayRef}\` dismissed by **${
          actorTag ?? actorId ?? 'Unknown'
        }**.`,
        `Last check: ${formatRelativeTimestamp(
          pendingSnapshot.lastCheckAt ?? state.lastCheckAt,
          'Unknown',
        )}`,
        `Last pull: ${formatRelativeTimestamp(state.lastPullAt)}`,
      ].join('\n'),
    }),
  });

  await updateChannelTopic();

  return pendingSnapshot;
};

export const isGitAutoPullButtonInteraction = (interaction) =>
  Boolean(interaction?.isButton?.() && isGitAutoPullCustomId(interaction.customId));

const respondToInteraction = async (interaction, payload) => {
  if (interaction.deferred) {
    await interaction.editReply(payload);
    return;
  }

  if (interaction.replied) {
    await interaction.followUp(payload);
    return;
  }

  await interaction.reply(payload);
};

export const handleGitAutoPullButtonInteraction = async (interaction) => {
  const parsed = parseButtonCustomId(interaction.customId);

  if (!parsed) {
    await respondToInteraction(interaction, {
      embeds: [
        buildErrorEmbed({
          description: 'Invalid git auto-pull action.',
        }),
      ],
      ephemeral: true,
    });
    return;
  }

  if (!state.pendingUpdate || state.pendingUpdate.token !== parsed.token) {
    await respondToInteraction(interaction, {
      embeds: [
        buildWarningEmbed({
          title: 'No pending update',
          description:
            'The referenced update is no longer available. Try running `!gitpull check`.',
        }),
      ],
      ephemeral: true,
    });
    return;
  }

  const hasAccess = await isSuperuser(interaction.user.id);

  if (!hasAccess) {
    await respondToInteraction(interaction, {
      embeds: [
        buildErrorEmbed({
          description: 'Only superusers can manage repository updates.',
        }),
      ],
      ephemeral: true,
    });
    return;
  }

  try {
    await interaction.deferReply({ ephemeral: true });

    if (parsed.action === 'confirm') {
      const result = await confirmPendingGitUpdate({
        actorId: interaction.user.id,
        actorTag: interaction.user.tag,
      });

      const restartNotice =
        typeof result.scheduledRestartInMs === 'number'
          ? `Restarting in ${(result.scheduledRestartInMs / 1000).toFixed(1)}s.`
          : 'Restart scheduled.';

      await interaction.editReply({
        embeds: [
          buildSuccessEmbed({
            title: 'Pull confirmed',
            description: [
              `Applied updates from \`${result.remoteRef}\`.`,
              restartNotice,
            ].join('\n'),
          }),
        ],
      });
      return;
    }

    if (parsed.action === 'cancel') {
      const pendingSnapshot = await cancelPendingGitUpdate({
        actorId: interaction.user.id,
        actorTag: interaction.user.tag,
      });

      await interaction.editReply({
        embeds: [
          buildSuccessEmbed({
            title: 'Update dismissed',
            description: [
              `Dismissed pending update for \`${pendingSnapshot.remoteRef}\`.`,
              `Last check was ${formatRelativeTimestamp(
                pendingSnapshot.lastCheckAt ?? state.lastCheckAt,
                'Unknown',
              )}.`,
            ].join('\n'),
          }),
        ],
      });
      return;
    }

    await interaction.editReply({
      embeds: [
        buildWarningEmbed({
          title: 'Unknown action',
          description: 'This update action is not recognized.',
        }),
      ],
    });
  } catch (error) {
    console.error(`${logPrefix} Failed to handle auto-pull button:`, error);
    await respondToInteraction(interaction, {
      embeds: [
        buildErrorEmbed({
          description:
            'Something went wrong while processing the git auto-pull action.',
        }),
      ],
      ephemeral: true,
    });
  }
};
