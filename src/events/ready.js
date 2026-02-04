import { logger } from '../services/logger.js';

export default {
  name: 'ready',
  once: true,
  execute(client) {
    logger.info(`Logged in as ${client.user?.tag ?? 'unknown user'}`);
  },
};
