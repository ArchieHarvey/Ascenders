import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage) {
    if (!newMessage.guild) {
      return;
    }

    if (oldMessage.content === newMessage.content) {
      return;
    }

    await recordLogEvent({
      event: loggingEvents.MESSAGE_UPDATE,
      guild: newMessage.guild,
      data: {
        channelId: newMessage.channelId,
        messageId: newMessage.id,
        author: newMessage.author
          ? {
              id: newMessage.author.id,
              tag: newMessage.author.tag,
            }
          : null,
        before: oldMessage.content ?? null,
        after: newMessage.content ?? null,
      },
    });
  },
};

