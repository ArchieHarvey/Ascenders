import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.GuildMemberAdd,
  async execute(member) {
    await recordLogEvent({
      event: loggingEvents.MEMBER_JOIN,
      guild: member.guild,
      data: {
        member: {
          id: member.id,
          tag: member.user?.tag,
          createdAt: member.user?.createdAt,
        },
      },
    });
  },
};

