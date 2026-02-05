import { Client, GatewayIntentBits } from "discord.js";
import { config } from "./config/index.js";
import { readyEvent } from "./events/ready.js";
import { interactionCreateEvent } from "./events/interactionCreate.js";
import { GitUpdater } from "./services/gitUpdater.js";
import { logger } from "./services/logger.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(readyEvent.name, (...args) => readyEvent.execute(...args));
client.on(interactionCreateEvent.name, (...args) =>
  interactionCreateEvent.execute(...args)
);

const gitUpdater = new GitUpdater({
  intervalMs: config.updateCheckIntervalMs,
  alertChannelId: config.updateAlertChannelId,
  ownerIds: config.ownerIds,
});
client.gitUpdater = gitUpdater;
gitUpdater.setClient(client);

gitUpdater.start();

client.login(config.token).catch((error) => {
  logger.error("Failed to login.", { error: error?.message });
  process.exit(1);
});
