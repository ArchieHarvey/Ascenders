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

    if (
      oldMessage.content === newMessage.content &&
      oldMessage.cleanContent === newMessage.cleanContent
    ) {
      return;
    }

    const channelName = newMessage.channel?.name ?? null;
    const attachments = Array.from(newMessage.attachments?.values?.() ?? []).map(
      (attachment) => ({
        id: attachment.id,
        name: attachment.name ?? 'Attachment',
        size: attachment.size ?? null,
        url: attachment.url ?? null,
        contentType: attachment.contentType ?? null,
      }),
    );

    await recordLogEvent({
      event: loggingEvents.MESSAGE_UPDATE,
      guild: newMessage.guild,
      data: {
        channelId: newMessage.channelId,
        channelName,
        messageId: newMessage.id,
        messageUrl: newMessage.url ?? null,
        author: newMessage.author
          ? {
              id: newMessage.author.id,
              tag: newMessage.author.tag,
            }
          : null,
        before: oldMessage.content ?? null,
        after: newMessage.content ?? null,
        attachments,
        beforePartial: Boolean(oldMessage.partial),
        afterPartial: Boolean(newMessage.partial),
        createdTimestamp:
          typeof newMessage.createdTimestamp === 'number'
            ? newMessage.createdTimestamp
            : null,
        editedTimestamp:
          typeof newMessage.editedTimestamp === 'number'
            ? newMessage.editedTimestamp
            : Date.now(),
      },
    });
  },
};
