import { Events } from 'discord.js';
import {
  loggingEvents,
  recordLogEvent,
} from '../../features/logging/loggingService.js';

export default {
  name: Events.GuildAuditLogEntryCreate,
  async execute(entry, guild) {
    await recordLogEvent({
      event: loggingEvents.AUDIT_LOG,
      guild,
      data: {
        action: entry.action,
        executorId: entry.executorId,
        targetId: entry.targetId,
        reason: entry.reason ?? null,
        changes:
          entry.changes?.map((change) => ({
            key: change.key,
            old: change.old ?? null,
            new: change.new ?? null,
          })) ?? [],
      },
    });
  },
};

