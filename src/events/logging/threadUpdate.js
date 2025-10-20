import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.ThreadUpdate,
  async execute(oldThread, newThread) {
    if (!newThread.guild) {
      return;
    }

    await recordLogEvent({
      event: loggingEvents.THREAD_UPDATE,
      guild: newThread.guild,
      data: {
        before: {
          id: oldThread.id,
          name: oldThread.name,
          archived: oldThread.archived,
          locked: oldThread.locked,
        },
        after: {
          id: newThread.id,
          name: newThread.name,
          archived: newThread.archived,
          locked: newThread.locked,
        },
      },
    });
  },
};

