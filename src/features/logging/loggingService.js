import { inspect } from 'node:util';
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
