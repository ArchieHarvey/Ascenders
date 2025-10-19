import {
  getGitAutoPullStatus,
  confirmPendingGitUpdate,
  cancelPendingGitUpdate,
  triggerManualGitCheck,
} from '../../jobs/gitAutoPullJob.js';
import { isSuperuser } from '../../services/roleService.js';
import {
  buildErrorEmbed,
  buildInfoEmbed,
  buildSuccessEmbed,
  buildWarningEmbed,
} from '../../utils/embed.js';

const reply = (message, payload) =>
  message.reply({
    ...payload,
    allowedMentions: { repliedUser: false, parse: [] },
  });

const formatCommits = (commits = []) => {
  if (!Array.isArray(commits) || commits.length === 0) {
    return 'No commits listed.';
  }
  return commits
    .slice(0, 5)
    .map((entry) => `\`${entry.hash}\` ${entry.message}`)
    .join('\n');
};

const formatRelativeTime = (value, fallback = 'Never') => {
  if (!value) {
    return fallback;
  }
  return `<t:${Math.floor(value / 1000)}:R>`;
};

const buildStatusEmbed = () => {
  const status = getGitAutoPullStatus();

  if (!status.enabled) {
    return buildWarningEmbed({
      title: 'Git auto-pull is disabled',
      description:
        'Set `GIT_AUTO_PULL_ENABLED=true` and configure a channel to activate this feature.',
    });
  }

  const fields = [
    status.usesRepositoryUrl
      ? {
          name: 'Repository',
          value: status.repositoryUrl ?? 'Not configured',
          inline: true,
        }
      : {
          name: 'Remote',
          value: status.remoteName
            ? `\`${status.remoteName}\``
            : 'Not configured',
          inline: true,
        },
    {
      name: 'Branch',
      value: `\`${status.branch}\``,
      inline: true,
    },
    {
      name: 'Interval',
      value: `${Math.round(status.intervalMs / 1000)}s`,
      inline: true,
    },
    {
      name: 'Channel',
      value: status.channelId ? `<#${status.channelId}>` : 'Not configured',
      inline: true,
    },
    {
      name: 'Tracking ref',
      value: status.trackingRef ? `\`${status.trackingRef}\`` : 'Not available',
    },
    {
      name: 'Last check',
      value: formatRelativeTime(status.lastCheckAt, 'Not yet'),
      inline: true,
    },
    {
      name: 'Last pull',
      value: formatRelativeTime(status.lastPullAt),
      inline: true,
    },
  ];

  if (status.pendingUpdate) {
    fields.push(
      {
        name: 'Pending commits',
        value: formatCommits(status.pendingUpdate.commits),
      },
      {
        name: 'Remote head',
        value: `\`${status.pendingUpdate.remoteHead}\``,
      },
      {
        name: 'Last check (pending)',
        value: formatRelativeTime(
          status.pendingUpdate.lastCheckAt ?? status.lastCheckAt,
          'Unknown',
        ),
      },
      {
        name: 'Last pull (overall)',
        value: formatRelativeTime(status.pendingUpdate.lastPullAt ?? status.lastPullAt),
      },
    );
  }

  if (status.lastError) {
    const message = status.lastError.message ?? 'Unknown error';
    fields.push({
      name: 'Last error',
      value:
        message.length > 512 ? `${message.slice(0, 509)}...` : message,
    });
  }

  return buildInfoEmbed({
    title: 'Git auto-pull status',
    fields,
  });
};

const buildPullResultEmbed = (result) => {
  const descriptionLines = [
    `Pulled updates from \`${result.remoteRef}\`.`,
  ];

  if (typeof result.scheduledRestartInMs === 'number') {
    descriptionLines.push(
      `Bot restart scheduled in ${(result.scheduledRestartInMs / 1000).toFixed(
        1,
      )}s.`,
    );
  }

  return buildSuccessEmbed({
    title: 'Git pull executed',
    description: descriptionLines.join('\n'),
    fields: [
      ...(result.remoteHead
        ? [
            {
              name: 'Remote head',
              value: `\`${result.remoteHead}\``,
            },
          ]
        : []),
      ...(result.lastCheckAt
        ? [
            {
              name: 'Last check',
              value: formatRelativeTime(result.lastCheckAt, 'Unknown'),
              inline: true,
            },
          ]
        : []),
      ...(result.lastPullAt
        ? [
            {
              name: 'Last pull',
              value: formatRelativeTime(result.lastPullAt),
              inline: true,
            },
          ]
        : []),
      ...(Array.isArray(result.commits) && result.commits.length
        ? [
            {
              name: 'Commits applied',
              value: formatCommits(result.commits),
            },
          ]
        : []),
      ...(() => {
        const combined = [result.stdout, result.stderr]
          .filter(Boolean)
          .map((entry) => entry.trim())
          .filter(Boolean)
          .join('\n');

        if (!combined) {
          return [];
        }

        const snippet =
          combined.length > 1000
            ? `${combined.slice(0, 1000)}...`
            : combined;

        return [
          {
            name: 'git pull output',
            value: `\`\`\`\n${snippet}\n\`\`\``,
          },
        ];
      })(),
    ],
  });
};

const ensureSuperuser = async (message) => {
  const allowed = await isSuperuser(message.author.id);
  if (allowed) {
    return true;
  }

  await reply(
    message,
    {
      embeds: [
        buildErrorEmbed({
          description: 'Only superusers can run that action.',
        }),
      ],
    },
  );

  return false;
};

export default {
  name: 'gitpull',
  description: 'Manage the automatic git pull workflow.',
  aliases: ['pullupdates', 'autopull'],
  usage: '<status|confirm|cancel|check>',
  async execute(message, args) {
    const action = args.shift()?.toLowerCase() ?? 'status';

    switch (action) {
      case 'status': {
        await reply(message, { embeds: [buildStatusEmbed()] });
        return;
      }

      case 'check': {
        if (!(await ensureSuperuser(message))) {
          return;
        }

        const result = await triggerManualGitCheck();
        if (!result) {
          await reply(message, {
            embeds: [
              buildWarningEmbed({
                title: 'Unable to check git status',
                description:
                  'See application logs for details or ensure the watcher is enabled.',
              }),
            ],
          });
          return;
        }

        const timingFields = [
          {
            name: 'Last check',
            value: formatRelativeTime(result.lastCheckAt, 'Just now'),
            inline: true,
          },
          {
            name: 'Last pull',
            value: formatRelativeTime(result.lastPullAt),
            inline: true,
          },
        ];

        if (result.aheadCount > 0) {
          await reply(message, {
            embeds: [
              buildWarningEmbed({
                title: 'Updates detected',
                description: `\`${result.remoteRef}\` is ahead by ${result.aheadCount} commit(s).`,
                fields: [
                  ...timingFields,
                  {
                    name: 'Commits',
                    value: formatCommits(result.commits),
                  },
                ],
              }),
            ],
          });
          return;
        }

        await reply(message, {
          embeds: [
            buildSuccessEmbed({
              title: 'Repository is up to date',
              description: `\`${result.remoteRef}\` has no new commits.`,
              fields: timingFields,
            }),
          ],
        });
        return;
      }

      case 'confirm': {
        if (!(await ensureSuperuser(message))) {
          return;
        }

        try {
          const result = await confirmPendingGitUpdate({
            actorId: message.author.id,
            actorTag: message.author.tag,
          });

          await reply(message, { embeds: [buildPullResultEmbed(result)] });
        } catch (error) {
          await reply(message, {
            embeds: [
              buildErrorEmbed({
                description: error.message ?? 'Failed to pull updates.',
              }),
            ],
          });
        }
        return;
      }

      case 'cancel': {
        if (!(await ensureSuperuser(message))) {
          return;
        }

        try {
          const pending = await cancelPendingGitUpdate({
            actorId: message.author.id,
            actorTag: message.author.tag,
          });

          await reply(message, {
            embeds: [
              buildSuccessEmbed({
                title: 'Pending update dismissed',
                description: `Cleared pending update for \`${pending.remoteRef}\`.`,
                fields: [
                  {
                    name: 'Last check',
                    value: formatRelativeTime(pending.lastCheckAt, 'Unknown'),
                    inline: true,
                  },
                  {
                    name: 'Last pull',
                    value: formatRelativeTime(pending.lastPullAt),
                    inline: true,
                  },
                ],
              }),
            ],
          });
        } catch (error) {
          await reply(message, {
            embeds: [
              buildErrorEmbed({
                description: error.message ?? 'Failed to dismiss update.',
              }),
            ],
          });
        }
        return;
      }

      default: {
        await reply(message, {
          embeds: [
            buildInfoEmbed({
              title: 'Usage',
              description:
                '`gitpull status` · `gitpull check` · `gitpull confirm` · `gitpull cancel`',
            }),
          ],
        });
      }
    }
  },
};
