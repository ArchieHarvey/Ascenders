import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.MessageDelete,
  async execute(message) {
    if (!message.guild) {
      return;
    }

    await recordLogEvent({
      event: loggingEvents.MESSAGE_DELETE,
      guild: message.guild,
      data: {
        channelId: message.channelId,
        messageId: message.id,
        author: message.author
          ? {
              id: message.author.id,
              tag: message.author.tag,
            }
          : null,
        hadContent: Boolean(message.content),
      },
    });
  },
};

