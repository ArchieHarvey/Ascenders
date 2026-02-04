import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { env } from './config/env.js';
import { logger } from './services/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

const loadEvents = async () => {
  const eventsPath = join(__dirname, 'events');
  const eventFiles = (await readdir(eventsPath)).filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const fileUrl = pathToFileURL(join(eventsPath, file));
    const { default: event } = await import(fileUrl);

    if (!event?.name || typeof event.execute !== 'function') {
      logger.warn(`Skipping event file ${file} because it is missing required exports.`);
      continue;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
};

const start = async () => {
  await loadEvents();
  await client.login(env.discordToken);
  logger.info('Discord client login initiated.');
};

start().catch((error) => {
  logger.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
