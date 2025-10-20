import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.GuildMemberRemove,
  async execute(member) {
    await recordLogEvent({
      event: loggingEvents.MEMBER_LEAVE,
      guild: member.guild,
      data: {
        member: {
          id: member.id,
          tag: member.user?.tag,
          joinedAt: member.joinedAt,
        },
      },
    });
  },
};

