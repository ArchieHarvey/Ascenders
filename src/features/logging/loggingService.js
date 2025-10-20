import { inspect } from 'node:util';
import { EmbedBuilder, Colors, AuditLogEvent, PermissionsBitField } from 'discord.js';
import {
  getGuildLoggingConfig,
} from '../../services/loggingSettingsService.js';

export const loggingEvents = {
  MEMBER_JOIN: 'guild.member.join',
  MEMBER_LEAVE: 'guild.member.leave',
  MEMBER_KICK: 'guild.member.kick',
  MEMBER_BAN_ADD: 'guild.ban.add',
  MEMBER_BAN_REMOVE: 'guild.ban.remove',
  ROLE_CREATE: 'role.create',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
  CHANNEL_CREATE: 'channel.create',
  CHANNEL_UPDATE: 'channel.update',
  CHANNEL_DELETE: 'channel.delete',
  THREAD_CREATE: 'thread.create',
  THREAD_UPDATE: 'thread.update',
  THREAD_DELETE: 'thread.delete',
  MESSAGE_DELETE: 'message.delete',
  MESSAGE_BULK_DELETE: 'message.bulk_delete',
  MESSAGE_UPDATE: 'message.update',
  AUDIT_LOG: 'audit.entry.create',
};

const eventCategoryMap = {
  [loggingEvents.MEMBER_JOIN]: 'member',
  [loggingEvents.MEMBER_LEAVE]: 'member',
  [loggingEvents.MEMBER_KICK]: 'member',
  [loggingEvents.MEMBER_BAN_ADD]: 'member',
  [loggingEvents.MEMBER_BAN_REMOVE]: 'member',
  [loggingEvents.ROLE_CREATE]: 'role',
  [loggingEvents.ROLE_UPDATE]: 'role',
  [loggingEvents.ROLE_DELETE]: 'role',
  [loggingEvents.CHANNEL_CREATE]: 'channel',
  [loggingEvents.CHANNEL_UPDATE]: 'channel',
  [loggingEvents.CHANNEL_DELETE]: 'channel',
  [loggingEvents.THREAD_CREATE]: 'thread',
  [loggingEvents.THREAD_UPDATE]: 'thread',
  [loggingEvents.THREAD_DELETE]: 'thread',
  [loggingEvents.MESSAGE_DELETE]: 'message',
  [loggingEvents.MESSAGE_BULK_DELETE]: 'message',
  [loggingEvents.MESSAGE_UPDATE]: 'message',
  [loggingEvents.AUDIT_LOG]: 'audit',
};

const formatValue = (value) =>
  typeof value === 'string' ? value : inspect(value, { depth: 2, breakLength: 120 });

const AUDIT_FETCH_DELAY_MS = 1000;

const truncate = (text, maxLength = 1024) => {
  if (!text) {
    return text;
  }
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 3)}...`;
};

const resolveLogChannel = async (guild, channelId) => {
  if (!channelId) {
    return null;
  }

  const cached = guild.channels.cache.get(channelId);
  if (cached) {
    return cached;
  }

  try {
    return await guild.channels.fetch(channelId);
  } catch (error) {
    console.warn(
      `[ServerLogger] Unable to fetch logging channel ${channelId} in ${guild.id}:`,
      error,
    );
    return null;
  }
};

const formatAuthorValue = (author) => {
  if (!author) {
    return 'Unknown author';
  }

  const mention = author.id ? `<@${author.id}>` : null;
  const tag = author.tag ?? 'Unknown tag';

  if (mention) {
    return `${mention}\n${tag} [${author.id}]`;
  }

  return author.id ? `${tag} [${author.id}]` : tag;
};

const formatUserInline = (user) => {
  if (!user) {
    return 'Unknown user';
  }

  const mention = user.id ? `<@${user.id}>` : null;
  const tag = user.tag ?? 'Unknown tag';
  const idPart = user.id ? `[${user.id}]` : null;

  return [mention, tag, idPart].filter(Boolean).join(' ');
};

const handleMessageDeleteLog = async ({ guild, config, data }) => {
  const logChannel = await resolveLogChannel(guild, config.channelId);

  if (!logChannel || !logChannel.isTextBased?.()) {
    return false;
  }

  const originChannel =
    guild.channels.cache.get(data.channelId) ?? null;
  const originMention = originChannel
    ? originChannel.toString()
    : `<#${data.channelId}>`;
  const channelNameLabel = originChannel?.name ?? data.channelName ?? 'Unknown channel';
  const channelDescriptor = `${originMention} (${channelNameLabel}) [${data.channelId}]`;

  const fields = [];
  const content = data.content?.trim?.();

  fields.push({
    name: 'Content',
    value: content
      ? truncate(content, 1024)
      : data.partial
        ? 'Content unavailable (message was partial or empty).'
        : 'No content (message was empty).',
    inline: false,
  });

  if (Array.isArray(data.attachments) && data.attachments.length > 0) {
    const attachmentLines = data.attachments
      .slice(0, 10)
      .map((attachment) => {
        if (attachment.url) {
          const label = attachment.name ?? 'Attachment';
          return `[${label}](${attachment.url})`;
        }
        return attachment.name ?? 'Attachment';
      })
      .join('\n');

    fields.push({
      name: `Attachments (${data.attachments.length})`,
      value: truncate(attachmentLines, 1024),
      inline: false,
    });

    if (data.attachments.length > 10) {
      fields.push({
        name: 'More Attachments',
        value: `+${data.attachments.length - 10} additional attachment(s)`,
        inline: false,
      });
    }
  }

  fields.push({
    name: 'Author',
    value: formatAuthorValue(data.author),
    inline: true,
  });

  let executorInline = null;

  try {
    const selfMember = guild.members.me;
    if (selfMember?.permissions?.has(PermissionsBitField.Flags.ViewAuditLog)) {
      // Give Discord a moment to record the audit entry before fetching.
      await new Promise((resolve) => setTimeout(resolve, AUDIT_FETCH_DELAY_MS));

      const audits = await guild.fetchAuditLogs({
        limit: 5,
        type: AuditLogEvent.MessageDelete,
      });

      const now = Date.now();
      const entry = audits.entries.find((log) => {
        if (!log) {
          return false;
        }
        if (now - log.createdTimestamp > 15_000) {
          return false;
        }
        if (log.extra?.channel?.id && log.extra.channel.id !== data.channelId) {
          return false;
        }
        if (data.author?.id && log.target?.id && log.target.id !== data.author.id) {
          return false;
        }
        return true;
      });

      const executor = entry?.executor;
      if (executor && executor.id !== data.author?.id) {
        executorInline = formatUserInline({
          id: executor.id,
          tag: executor.tag,
        });
      }
    }
  } catch (error) {
    console.warn('[ServerLogger] Failed to inspect audit log entry:', error);
  }

  const description = executorInline
    ? `A message was deleted in ${channelDescriptor} • Deleted by ${executorInline}.`
    : `A message was deleted in ${channelDescriptor}.`;

  if (typeof data.createdTimestamp === 'number') {
    const createdSeconds = Math.floor(data.createdTimestamp / 1000);
    fields.push({
      name: 'Created',
      value: `<t:${createdSeconds}:R> (<t:${createdSeconds}:f>)`,
      inline: true,
    });
  }

  const deletedSeconds = Math.floor(Date.now() / 1000);
  fields.push({
    name: 'Deleted',
    value: `<t:${deletedSeconds}:R> (<t:${deletedSeconds}:f>)`,
    inline: true,
  });

  const embed = new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle('Message Deleted')
    .setDescription(description)
    .setFields(fields)
    .setFooter({
      text: `Server Logger • Message ID: ${
        data.messageId ?? 'Unknown'
      }`,
    })
    .setTimestamp(new Date());

  try {
    await logChannel.send({ embeds: [embed] });
    return true;
  } catch (error) {
    console.error(
      `[ServerLogger] Failed to send message delete log to ${logChannel.id}:`,
      error,
    );
    return false;
  }
};

const logHandlers = {
  [loggingEvents.MESSAGE_DELETE]: handleMessageDeleteLog,
};

export const recordLogEvent = async ({ event, guild, data }) => {
  if (!guild) {
    return;
  }

  try {
    const config = await getGuildLoggingConfig(guild.id);

    if (!config.enabled || !config.channelId) {
      return;
    }

    const category = eventCategoryMap[event];
    if (category && config.events?.[category] === false) {
      return;
    }

    const handler = logHandlers[event];
    if (handler) {
      const handled = await handler({ guild, config, data });
      if (handled) {
        return;
      }
    }

    const guildLabel = `${guild.name} (${guild.id})`;
    const rendered = formatValue(data);
    // Placeholder implementation: console log.
    // eslint-disable-next-line no-console
    console.log(
      `[ServerLogger] [${event}] @ ${guildLabel} -> channel ${config.channelId}: ${rendered}`,
    );
  } catch (error) {
    console.error('[ServerLogger] Failed to process log event:', error);
  }
};
