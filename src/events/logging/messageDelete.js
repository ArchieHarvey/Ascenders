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

  const attachments = Array.from(message.attachments?.values?.() ?? []).map(
    (attachment) => ({
      id: attachment.id,
      name: attachment.name ?? 'Attachment',
      size: attachment.size ?? null,
      url: attachment.url ?? null,
      contentType: attachment.contentType ?? null,
    }),
  );

  await recordLogEvent({
    event: loggingEvents.MESSAGE_DELETE,
    guild: message.guild,
    data: {
      channelId: message.channelId,
      channelName: message.channel?.name ?? null,
      messageId: message.id,
      author: message.author
        ? {
            id: message.author.id,
            tag: message.author.tag,
          }
        : null,
      content: message.partial ? null : message.content ?? null,
      attachments,
      partial: message.partial,
      createdTimestamp:
        typeof message.createdTimestamp === 'number'
          ? message.createdTimestamp
          : null,
    },
  });
  },
};

