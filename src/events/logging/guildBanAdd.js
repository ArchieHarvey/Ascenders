import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.GuildBanAdd,
  async execute(ban) {
    await recordLogEvent({
      event: loggingEvents.MEMBER_BAN_ADD,
      guild: ban.guild,
      data: {
        user: {
          id: ban.user?.id,
          tag: ban.user?.tag,
        },
        reason: ban.reason ?? null,
      },
    });
  },
};

