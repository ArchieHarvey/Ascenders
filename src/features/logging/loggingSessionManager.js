import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  StringSelectMenuBuilder,
} from 'discord.js';
import {
  clearLoggingChannel,
  disableLogging,
  getGuildLoggingConfig,
  setLoggingChannel,
  updateLoggingEvents,
} from '../../services/loggingSettingsService.js';
import { buildInfoEmbed, buildWarningEmbed } from '../../utils/embed.js';

const SESSION_TIMEOUT_MS = 60_000;

const BUTTON_IDS = {
  SET_CHANNEL: 'logging:set_channel',
  TOGGLE_EVENTS: 'logging:toggle_events',
  ENABLE: 'logging:enable',
  DISABLE: 'logging:disable',
  CLEAR: 'logging:clear',
  REFRESH: 'logging:refresh',
  CONFIRM: 'logging:confirm',
  CANCEL: 'logging:cancel',
};

const SELECT_IDS = {
  CHANNEL: 'logging:select_channel',
  EVENTS: 'logging:select_events',
};

const CATEGORY_LABELS = {
  member: 'Member events',
  role: 'Role events',
  channel: 'Channel events',
  thread: 'Thread events',
  message: 'Message events',
  audit: 'Audit-log events',
};

const loggingSessions = new Map();

const deepClone = (value) => {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, val]) => [key, deepClone(val)]),
  );
};

const formatChannelValue = (guild, channelId) => {
  if (!channelId) {
    return 'Not configured';
  }
  const channel = guild?.channels?.cache?.get(channelId);
  return channel ? channel.toString() : `Unknown channel (${channelId})`;
};

const buildTimerField = (session, expired) => ({
  name: expired ? 'Actions expired' : 'Actions expire',
  value: expired
    ? `Expired <t:${session.expiresAtSeconds}:R>. Run the command again to continue managing logging.`
    : `Controls disable <t:${session.expiresAtSeconds}:R>.`,
});

const buildViewDescription = (session) => {
  const lines = [];
  lines.push(
    session.config.enabled
      ? 'Logging is currently **enabled**.'
      : 'Logging is currently **disabled**.',
  );

  if (!session.config.channelId) {
    lines.push(
      '',
      'Use **Set Channel** to configure the logging channel and enable logging.',
    );
  }

  if (session.notice) {
    lines.push('', session.notice);
    session.notice = null;
  }

  return lines.join('\n').trim();
};

const buildViewEmbed = (session, guild, expired) =>
  buildInfoEmbed({
    title: 'Server Logging',
    description: buildViewDescription(session),
    fields: [
      {
        name: 'Log Channel',
        value: formatChannelValue(guild, session.config.channelId),
        inline: true,
      },
      {
        name: 'Enabled Events',
        value: session.config.channelId
          ? Object.entries(CATEGORY_LABELS)
              .map(([key, label]) => {
                const isActive = session.config.enabled && session.config.events[key];
                const status = isActive ? '[ON] ' : '[OFF] ';
                return `${status}${label}`;
              })
              .join('\n')
          : 'Set a log channel to configure individual event categories.',
      },
      buildTimerField(session, expired),
    ],
    footer: session.config.updatedByTag
      ? {
          text: `Last updated by ${session.config.updatedByTag}${
            session.config.updatedAt
              ? ` on ${session.config.updatedAt.toLocaleString()}`
              : ''
          }`,
        }
      : null,
  });

const buildSetChannelEmbed = (session, guild, expired) => {
  const lines = [
    'Select the channel that should receive logging messages.',
    'Only text, announcement, voice, stage, or forum channels can be used.',
  ];

  return buildInfoEmbed({
    title: 'Set Logging Channel',
    description: lines.join('\n'),
    fields: [buildTimerField(session, expired)],
  });
};

const buildEventsEmbed = (session, expired) => {
  const lines = [
    'Choose one or more categories to toggle. Selected categories will flip between enabled and disabled.',
  ];

  return buildInfoEmbed({
    title: 'Toggle Logging Categories',
    description: lines.join('\n'),
    fields: [buildTimerField(session, expired)],
  });
};

const buildConfirmEmbed = (session, guild, expired) => {
  let title = 'Confirm Logging Change';
  let description = '';

  switch (session.pendingAction) {
    case 'setChannel': {
      const channelObj =
        guild?.channels?.cache?.get(session.pendingData.channelId) ?? null;
      const mention = channelObj
        ? channelObj.toString()
        : `<#${session.pendingData.channelId}>`;
      title = 'Confirm Logging Channel';
      description = `Set the logging channel to ${mention}?`;
      break;
    }
    case 'enable': {
      const channelMention = formatChannelValue(
        guild,
        session.config.channelId,
      );
      title = 'Enable Logging';
      description = `Enable logging using ${channelMention}?`;
      break;
    }
    case 'disable': {
      title = 'Disable Logging';
      description =
        'Disable logging for this server? No events will be recorded until logging is enabled again.';
      break;
    }
    case 'clear': {
      title = 'Clear Logging Channel';
      description =
        'Clear the logging channel and disable logging? This will stop logging until a new channel is set.';
      break;
    }
    case 'events': {
      const changes = session.pendingData.changes
        .map(({ key, value }) => {
          const status = value ? '[ON] ' : '[OFF] ';
          return `${status}${CATEGORY_LABELS[key] ?? key}`;
        })
        .join('\n');
      title = 'Update Logging Categories';
      description = [
        'Apply the following category changes?',
        '',
        changes || 'No changes detected.',
      ].join('\n');
      break;
    }
    default:
      description = 'Apply this change?';
  }

  if (session.notice) {
    description = `${description}\n\n${session.notice}`;
    session.notice = null;
  }

  return buildWarningEmbed({
    title,
    description,
    fields: [buildTimerField(session, expired)],
  });
};

const buildExpiredEmbed = (session, guild) =>
  buildWarningEmbed({
    title: 'Logging Session Expired',
    description:
      'The logging control panel has expired. Run the logging command again to continue.',
    fields: [
      {
        name: 'Log Channel',
        value: formatChannelValue(guild, session.config.channelId),
        inline: true,
      },
      {
        name: 'Status',
        value: session.config.enabled
          ? 'Logging remains enabled.'
          : 'Logging remains disabled.',
        inline: true,
      },
      {
        name: 'Actions expired',
        value:
          `Expired <t:${session.expiresAtSeconds}:R>. Run the command again for a new session.`,
      },
    ],
  });

const buildViewComponents = (session, expired) => {
  const disabled = expired;
  const hasChannel = Boolean(session.config.channelId);

  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(BUTTON_IDS.SET_CHANNEL)
      .setLabel(hasChannel ? 'Change Channel' : 'Set Channel')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId(BUTTON_IDS.TOGGLE_EVENTS)
      .setLabel('Toggle Events')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled || !hasChannel),
    new ButtonBuilder()
      .setCustomId(
        session.config.enabled ? BUTTON_IDS.DISABLE : BUTTON_IDS.ENABLE,
      )
      .setLabel(session.config.enabled ? 'Disable Logging' : 'Enable Logging')
      .setStyle(
        session.config.enabled ? ButtonStyle.Danger : ButtonStyle.Success,
      )
      .setDisabled(
        disabled || (!hasChannel && !session.config.enabled),
      ),
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(BUTTON_IDS.CLEAR)
      .setLabel('Clear Channel')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(disabled || !hasChannel),
    new ButtonBuilder()
      .setCustomId(BUTTON_IDS.REFRESH)
      .setLabel('Refresh')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled),
  );

  return [row1, row2];
};

const buildSetChannelComponents = (expired) => {
  const selectRow = new ActionRowBuilder().addComponents(
    new ChannelSelectMenuBuilder()
      .setCustomId(SELECT_IDS.CHANNEL)
      .setPlaceholder('Choose a logging channel')
      .setMinValues(1)
      .setMaxValues(1)
      .addChannelTypes(
        ChannelType.GuildText,
        ChannelType.GuildAnnouncement,
        ChannelType.GuildVoice,
        ChannelType.GuildStageVoice,
        ChannelType.GuildForum,
      )
      .setDisabled(expired),
  );

  const controlRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(BUTTON_IDS.CANCEL)
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(expired),
  );

  return [selectRow, controlRow];
};

const buildEventsComponents = (session, expired) => {
  const options = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    label,
    value: key,
    description: session.config.events[key]
      ? 'Currently enabled'
      : 'Currently disabled',
  }));

  const selectRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(SELECT_IDS.EVENTS)
      .setPlaceholder('Select categories to toggle')
      .setMinValues(1)
      .setMaxValues(options.length)
      .setOptions(options)
      .setDisabled(expired),
  );

  const controlRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(BUTTON_IDS.CANCEL)
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(expired),
  );

  return [selectRow, controlRow];
};

const buildConfirmComponents = (session, expired) => {
  let confirmStyle = ButtonStyle.Primary;
  switch (session.pendingAction) {
    case 'disable':
    case 'clear':
      confirmStyle = ButtonStyle.Danger;
      break;
    case 'enable':
    case 'setChannel':
    case 'events':
    default:
      confirmStyle = ButtonStyle.Success;
  }

  const confirmRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(BUTTON_IDS.CONFIRM)
      .setLabel('Confirm')
      .setStyle(confirmStyle)
      .setDisabled(expired),
    new ButtonBuilder()
      .setCustomId(BUTTON_IDS.CANCEL)
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(expired),
  );

  return [confirmRow];
};

const buildComponents = (session, expired) => {
  switch (session.mode) {
    case 'setChannel':
      return buildSetChannelComponents(expired);
    case 'eventsSelect':
      return buildEventsComponents(session, expired);
    case 'confirm':
      return buildConfirmComponents(session, expired);
    case 'view':
    default:
      return buildViewComponents(session, expired);
  }
};

export const buildLoggingSessionPayload = (session, guild, { expired = false } = {}) => {
  let embed;
  if (expired) {
    embed = buildExpiredEmbed(session, guild);
  } else {
    switch (session.mode) {
      case 'setChannel':
        embed = buildSetChannelEmbed(session, guild, expired);
        break;
      case 'eventsSelect':
        embed = buildEventsEmbed(session, expired);
        break;
      case 'confirm':
        embed = buildConfirmEmbed(session, guild, expired);
        break;
      case 'view':
      default:
        embed = buildViewEmbed(session, guild, expired);
    }
  }

  const components = expired ? [] : buildComponents(session, expired);
  return { embeds: [embed], components };
};

export const createLoggingSessionState = async ({
  guildId,
  requestedById,
  requestedByTag,
}) => {
  const config = await getGuildLoggingConfig(guildId);
  const expiresAtMs = Date.now() + SESSION_TIMEOUT_MS;
  return {
    guildId,
    requestedById,
    requestedByTag,
    config: deepClone(config),
    mode: 'view',
    expiresAtMs,
    expiresAtSeconds: Math.floor(expiresAtMs / 1000),
    message: null,
    pendingAction: null,
    pendingData: null,
    notice: null,
    timeout: null,
  };
};

export const registerLoggingSession = (messageId, session) => {
  loggingSessions.set(messageId, session);
};

export const getLoggingSession = (messageId) => loggingSessions.get(messageId);

const clearSessionTimeout = (session) => {
  if (session?.timeout) {
    clearTimeout(session.timeout);
    session.timeout = null;
  }
};

export const endLoggingSession = (messageId) => {
  const session = loggingSessions.get(messageId);
  if (!session) {
    return;
  }
  clearSessionTimeout(session);
  loggingSessions.delete(messageId);
};

export const scheduleLoggingSessionExpiry = (session, messageId) => {
  clearSessionTimeout(session);
  const remainingMs = Math.max(0, session.expiresAtMs - Date.now());

  if (remainingMs <= 0) {
    return false;
  }

  session.timeout = setTimeout(async () => {
    const stored = loggingSessions.get(messageId);
    if (!stored) {
      return;
    }

    stored.mode = 'view';
    const payload = buildLoggingSessionPayload(
      stored,
      stored.message?.guild ?? null,
      { expired: true },
    );

    try {
      await stored.message?.edit(payload);
    } catch (error) {
      console.error('Failed to finalize logging session:', error);
    } finally {
      loggingSessions.delete(messageId);
    }
  }, remainingMs);

  return true;
};

export const isLoggingComponentInteraction = (interaction) =>
  typeof interaction.customId === 'string' &&
  interaction.customId.startsWith('logging:');

const ensureSessionActive = (session, interaction) => {
  if (interaction.user.id !== session.requestedById) {
    throw new Error('Only the original requester can use these controls.');
  }

  if (interaction.guildId !== session.guildId) {
    throw new Error('This logging session is no longer valid for this server.');
  }

  if (Date.now() >= session.expiresAtMs) {
    throw new Error('expired');
  }
};

const refreshConfig = async (session) => {
  const updated = await getGuildLoggingConfig(session.guildId);
  session.config = deepClone(updated);
};

const applyUpdate = async (interaction, session, payload, { defer = false } = {}) => {
  if (defer) {
    await interaction.deferUpdate();
    if (session.message) {
      await session.message.edit(payload);
    } else {
      await interaction.editReply(payload);
    }
  } else {
    await interaction.update(payload);
  }
};

export const handleLoggingComponentInteraction = async (interaction) => {
  const { customId } = interaction;
  const messageId = interaction.message?.id;

  if (!messageId) {
    await interaction.reply({
      content: 'Unable to locate the logging session for this interaction.',
      ephemeral: true,
    });
    return;
  }

  const session = getLoggingSession(messageId);

  if (!session) {
    await interaction.reply({
      content: 'This logging session has expired. Run the logging command again.',
      ephemeral: true,
    });
    return;
  }

  session.message = session.message ?? interaction.message ?? null;

  try {
    ensureSessionActive(session, interaction);
  } catch (error) {
    if (error.message === 'expired') {
      endLoggingSession(messageId);
      const payload = buildLoggingSessionPayload(
        session,
        interaction.guild,
        { expired: true },
      );
      await applyUpdate(interaction, session, payload, { defer: true });
      return;
    }

    await interaction.reply({
      content: error.message,
      ephemeral: true,
    });
    return;
  }

  switch (customId) {
    case BUTTON_IDS.SET_CHANNEL: {
      session.mode = 'setChannel';
      session.pendingAction = 'setChannel';
      session.pendingData = null;
      session.notice = null;
      const payload = buildLoggingSessionPayload(
        session,
        interaction.guild,
      );
      await applyUpdate(interaction, session, payload);
      return;
    }

    case BUTTON_IDS.TOGGLE_EVENTS: {
      if (!session.config.channelId) {
        await interaction.reply({
          content: 'Set a logging channel before toggling event categories.',
          ephemeral: true,
        });
        return;
      }
      session.mode = 'eventsSelect';
      session.pendingAction = 'events';
      session.pendingData = null;
      session.notice = null;
      const payload = buildLoggingSessionPayload(
        session,
        interaction.guild,
      );
      await applyUpdate(interaction, session, payload);
      return;
    }

    case BUTTON_IDS.ENABLE: {
      if (!session.config.channelId) {
        await interaction.reply({
          content: 'Set a logging channel before enabling logging.',
          ephemeral: true,
        });
        return;
      }
      session.mode = 'confirm';
      session.pendingAction = 'enable';
      session.pendingData = null;
      session.notice = null;
      const payload = buildLoggingSessionPayload(
        session,
        interaction.guild,
      );
      await applyUpdate(interaction, session, payload);
      return;
    }

    case BUTTON_IDS.DISABLE: {
      session.mode = 'confirm';
      session.pendingAction = 'disable';
      session.pendingData = null;
      session.notice = null;
      const payload = buildLoggingSessionPayload(
        session,
        interaction.guild,
      );
      await applyUpdate(interaction, session, payload);
      return;
    }

    case BUTTON_IDS.CLEAR: {
      if (!session.config.channelId) {
        await interaction.reply({
          content: 'No logging channel is configured to clear.',
          ephemeral: true,
        });
        return;
      }
      session.mode = 'confirm';
      session.pendingAction = 'clear';
      session.pendingData = null;
      session.notice = null;
      const payload = buildLoggingSessionPayload(
        session,
        interaction.guild,
      );
      await applyUpdate(interaction, session, payload);
      return;
    }

    case BUTTON_IDS.REFRESH: {
      await interaction.deferUpdate();
      try {
        await refreshConfig(session);
        session.mode = 'view';
        session.pendingAction = null;
        session.pendingData = null;
        session.notice = 'Configuration refreshed.';
      } catch (error) {
        console.error('Failed to refresh logging config:', error);
        session.notice = 'Unable to refresh configuration right now.';
      }
      const payload = buildLoggingSessionPayload(
        session,
        interaction.guild,
      );
      if (session.message) {
        await session.message.edit(payload);
      } else {
        await interaction.editReply(payload);
      }
      return;
    }

    case BUTTON_IDS.CANCEL: {
      session.mode = 'view';
      session.pendingAction = null;
      session.pendingData = null;
      session.notice = 'Action cancelled.';
      const payload = buildLoggingSessionPayload(
        session,
        interaction.guild,
      );
      await applyUpdate(interaction, session, payload);
      return;
    }

    case BUTTON_IDS.CONFIRM: {
      if (!session.pendingAction) {
        await interaction.reply({
          content: 'No pending action to confirm.',
          ephemeral: true,
        });
        return;
      }

      await interaction.deferUpdate();

      try {
        switch (session.pendingAction) {
          case 'setChannel': {
            await setLoggingChannel({
              guildId: session.guildId,
              channelId: session.pendingData.channelId,
              userId: session.requestedById,
              userTag: session.requestedByTag,
            });
            session.notice = 'Logging channel updated.';
            break;
          }
          case 'enable': {
            await setLoggingChannel({
              guildId: session.guildId,
              channelId: session.config.channelId,
              userId: session.requestedById,
              userTag: session.requestedByTag,
            });
            session.notice = 'Logging enabled.';
            break;
          }
          case 'disable': {
            await disableLogging({
              guildId: session.guildId,
              userId: session.requestedById,
              userTag: session.requestedByTag,
            });
            session.notice = 'Logging disabled.';
            break;
          }
          case 'clear': {
            await clearLoggingChannel({
              guildId: session.guildId,
              userId: session.requestedById,
              userTag: session.requestedByTag,
            });
            session.notice = 'Logging channel cleared.';
            break;
          }
          case 'events': {
            const diff = session.pendingData.changes.reduce((acc, { key, value }) => {
              acc[key] = value;
              return acc;
            }, {});
            await updateLoggingEvents({
              guildId: session.guildId,
              events: diff,
              userId: session.requestedById,
              userTag: session.requestedByTag,
            });
            session.notice = 'Logging categories updated.';
            break;
          }
          default:
            session.notice = 'Action completed.';
        }

        await refreshConfig(session);
      } catch (error) {
        console.error('Failed to apply logging change:', error);
        session.notice =
          error?.message ?? 'Unable to apply the requested change.';
      }

      session.mode = 'view';
      session.pendingAction = null;
      session.pendingData = null;

      const payload = buildLoggingSessionPayload(
        session,
        interaction.guild,
      );

      if (session.message) {
        await session.message.edit(payload);
      } else {
        await interaction.editReply(payload);
      }
      return;
    }

    case SELECT_IDS.CHANNEL: {
      if (!interaction.isChannelSelectMenu()) {
        return;
      }
      const channelId = interaction.values?.[0];
      if (!channelId) {
        await interaction.reply({
          content: 'Select a channel to continue.',
          ephemeral: true,
        });
        return;
      }
      session.pendingAction = 'setChannel';
      session.pendingData = { channelId };
      session.mode = 'confirm';
      session.notice = null;
      const payload = buildLoggingSessionPayload(
        session,
        interaction.guild,
      );
      await applyUpdate(interaction, session, payload);
      return;
    }

    case SELECT_IDS.EVENTS: {
      if (!interaction.isStringSelectMenu()) {
        return;
      }
      const values = interaction.values ?? [];
      if (!values.length) {
        await interaction.reply({
          content: 'Select at least one category to toggle.',
          ephemeral: true,
        });
        return;
      }

      const current = { ...session.config.events };
      const changes = [];

      for (const key of values) {
        if (!Object.prototype.hasOwnProperty.call(current, key)) {
          continue;
        }
        current[key] = !current[key];
        changes.push({ key, value: current[key] });
      }

      if (!changes.length) {
        session.notice = 'No changes detected.';
        session.mode = 'view';
        session.pendingAction = null;
        session.pendingData = null;
        const payload = buildLoggingSessionPayload(
          session,
          interaction.guild,
        );
        await applyUpdate(interaction, session, payload);
        return;
      }

      session.pendingAction = 'events';
      session.pendingData = { changes };
      session.mode = 'confirm';
      session.notice = null;
      const payload = buildLoggingSessionPayload(
        session,
        interaction.guild,
      );
      await applyUpdate(interaction, session, payload);
      return;
    }

    default:
      await interaction.reply({
        content: 'Unknown logging interaction.',
        ephemeral: true,
      });
  }
};
