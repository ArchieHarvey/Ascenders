import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.GuildRoleDelete,
  async execute(role) {
    await recordLogEvent({
      event: loggingEvents.ROLE_DELETE,
      guild: role.guild,
      data: {
        role: {
          id: role.id,
          name: role.name,
        },
      },
    });
  },
};

