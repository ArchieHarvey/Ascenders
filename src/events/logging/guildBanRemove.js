import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.GuildBanRemove,
  async execute(ban) {
    await recordLogEvent({
      event: loggingEvents.MEMBER_BAN_REMOVE,
      guild: ban.guild,
      data: {
        user: {
          id: ban.user?.id,
          tag: ban.user?.tag,
        },
      },
    });
  },
};

