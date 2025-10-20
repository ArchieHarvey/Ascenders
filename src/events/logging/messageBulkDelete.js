import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.MessageBulkDelete,
  async execute(messages) {
    const sample = messages.first();
    const guild = sample?.guild ?? null;

    if (!guild) {
      return;
    }

    await recordLogEvent({
      event: loggingEvents.MESSAGE_BULK_DELETE,
      guild,
      data: {
        channelId: sample.channelId,
        count: messages.size,
        messageIds: messages.map((msg) => msg.id),
      },
    });
  },
};

