import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.GuildRoleCreate,
  async execute(role) {
    await recordLogEvent({
      event: loggingEvents.ROLE_CREATE,
      guild: role.guild,
      data: {
        role: {
          id: role.id,
          name: role.name,
          color: role.hexColor,
          hoist: role.hoist,
          mentionable: role.mentionable,
        },
      },
    });
  },
};

