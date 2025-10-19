import { checkForRemoteUpdates } from '../services/updateService.js';
import { initiateUpdateWorkflow } from '../workflows/updateWorkflow.js';

let intervalHandle = null;
let pendingWorkflow = false;

const toIntervalMs = (value) => {
  const parsed = Number.parseInt(value ?? '', 10);
  const minutes = Number.isNaN(parsed) || parsed <= 0 ? 15 : parsed;
  return minutes * 60 * 1000;
};

export const startUpdateWatcher = (client) => {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }

  const channelId = process.env.UPDATE_CHANNEL_ID?.trim();

  if (!channelId) {
    return;
  }

  const intervalMs = toIntervalMs(process.env.AUTO_UPDATE_INTERVAL_MINUTES);

  const runCheck = async () => {
    if (pendingWorkflow) {
      return;
    }

    try {
      const channel = await client.channels.fetch(channelId);

      if (!channel?.isTextBased()) {
        return;
      }

      const updateInfo = await checkForRemoteUpdates();

      if (!updateInfo.hasUpdates) {
        return;
      }

      pendingWorkflow = true;

      const { collector } = await initiateUpdateWorkflow({
        sourceLabel: 'Automatic repository watcher',
        requester: client.user ?? { tag: client.user?.tag ?? 'Bot' },
        sendMessage: (payload) =>
          channel.send({
            ...payload,
            allowedMentions: { parse: [] },
          }),
        summary: [
          `Automatic watcher detected that repository \`${updateInfo.path}\` is behind by **${updateInfo.status.behindCount}** commit(s).`,
          'Review the status details and confirm to pull the latest changes.',
          '',
          '```',
          updateInfo.status.stdout,
          '```',
        ]
          .filter(Boolean)
          .join('\n')
          .slice(0, 3900),
      });

      collector.on('end', () => {
        pendingWorkflow = false;
      });
    } catch (error) {
      pendingWorkflow = false;
      console.error('Automatic update watcher failed:', error);
    }
  };

  // Kick off immediately then schedule.
  runCheck();
  intervalHandle = setInterval(runCheck, intervalMs);
};
