import { Events } from 'discord.js';
import { getOrCreateStatus } from '../services/botStatusService.js';
import { applyBotPresence } from '../utils/presence.js';
import { initializeGitAutoPull } from '../jobs/gitAutoPullJob.js';

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const { user } = client;
    console.log(`Logged in as ${user.tag}`);

    try {
      const status = await getOrCreateStatus();
      applyBotPresence(client, status);
      console.log(
        `Applied bot status "${status.message}" (${status.activityType}) from database.`,
      );
    } catch (error) {
      console.error('Failed to apply bot status from database:', error);
      applyBotPresence(client);
    }

    await initializeGitAutoPull(client);
  },
};
