import { logger } from "../services/logger.js";

export const readyEvent = {
  name: "ready",
  once: true,
  execute(client) {
    logger.info(`Logged in as ${client.user.tag}`);
  },
};
