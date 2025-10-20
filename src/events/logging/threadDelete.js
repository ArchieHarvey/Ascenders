import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.ThreadDelete,
  async execute(thread) {
    if (!thread.guild) {
      return;
    }

    await recordLogEvent({
      event: loggingEvents.THREAD_DELETE,
      guild: thread.guild,
      data: {
        thread: {
          id: thread.id,
          name: thread.name,
          parentId: thread.parentId ?? null,
        },
      },
    });
  },
};

