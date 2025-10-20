import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.GuildRoleUpdate,
  async execute(oldRole, newRole) {
    await recordLogEvent({
      event: loggingEvents.ROLE_UPDATE,
      guild: newRole.guild,
      data: {
        before: {
          id: oldRole.id,
          name: oldRole.name,
          color: oldRole.hexColor,
          hoist: oldRole.hoist,
          mentionable: oldRole.mentionable,
        },
        after: {
          id: newRole.id,
          name: newRole.name,
          color: newRole.hexColor,
          hoist: newRole.hoist,
          mentionable: newRole.mentionable,
        },
      },
    });
  },
};

