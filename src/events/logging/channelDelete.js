import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.ChannelDelete,
  async execute(channel) {
    if (!channel.guild) {
      return;
    }

    await recordLogEvent({
      event: loggingEvents.CHANNEL_DELETE,
      guild: channel.guild,
      data: {
        channel: {
          id: channel.id,
          name: channel.name,
          type: channel.type,
          parentId: channel.parentId ?? null,
        },
      },
    });
  },
};

