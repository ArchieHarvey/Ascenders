import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.ThreadCreate,
  async execute(thread) {
    if (!thread.guild) {
      return;
    }

    await recordLogEvent({
      event: loggingEvents.THREAD_CREATE,
      guild: thread.guild,
      data: {
        thread: {
          id: thread.id,
          name: thread.name,
          parentId: thread.parentId ?? null,
          ownerId: thread.ownerId ?? null,
        },
      },
    });
  },
};

