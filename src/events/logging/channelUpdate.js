import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.ChannelUpdate,
  async execute(oldChannel, newChannel) {
    if (!newChannel.guild) {
      return;
    }

    await recordLogEvent({
      event: loggingEvents.CHANNEL_UPDATE,
      guild: newChannel.guild,
      data: {
        before: {
          id: oldChannel.id,
          name: oldChannel.name,
          type: oldChannel.type,
          parentId: oldChannel.parentId ?? null,
        },
        after: {
          id: newChannel.id,
          name: newChannel.name,
          type: newChannel.type,
          parentId: newChannel.parentId ?? null,
        },
      },
    });
  },
};

