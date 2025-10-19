import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { connectDatabase, disconnectDatabase } from './database/index.js';
import { getDefaultPrefix } from './services/guildSettingsService.js';

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('Missing DISCORD_TOKEN in environment. Add it to your .env file.');
  process.exit(1);
}

const processManager =
  process.env.PROCESS_MANAGER?.trim().toLowerCase() ?? '';

if (processManager !== 'pm2') {
  console.error(
    'PROCESS_MANAGER must be set to "pm2" in the environment. Shutting down.',
  );
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.textCommands = new Collection();
const defaultPrefix = getDefaultPrefix();
client.defaultPrefix = defaultPrefix;
client.prefix = defaultPrefix;

const loadJsFiles = (directory) => {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const results = [];

  const traverse = (current) => {
    for (const dirent of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, dirent.name);

      if (dirent.isDirectory()) {
        traverse(fullPath);
        continue;
      }

      if (dirent.isFile() && dirent.name.toLowerCase().endsWith('.js')) {
        results.push(fullPath);
      }
    }
  };

  traverse(directory);
  results.sort((a, b) => a.localeCompare(b));
  return results;
};

const commandsPath = path.join(__dirname, 'commands');

for (const filePath of loadJsFiles(commandsPath)) {
  const { default: command } = await import(pathToFileURL(filePath).href);

  if (!command?.data || !command?.execute) {
    console.warn(
      `Slash command at ${filePath} is missing required "data" or "execute" export.`,
    );
    continue;
  }

  client.commands.set(command.data.name, command);
  console.log(`Loaded slash command: ${command.data.name}`);
}

const textCommandsPath = path.join(__dirname, 'textCommands');

for (const filePath of loadJsFiles(textCommandsPath)) {
  const { default: command } = await import(pathToFileURL(filePath).href);

  if (!command?.name || !command?.execute) {
    console.warn(
      `Text command at ${filePath} is missing required "name" or "execute" export.`,
    );
    continue;
  }

  client.textCommands.set(command.name.toLowerCase(), command);

  if (Array.isArray(command.aliases)) {
    for (const alias of command.aliases) {
      client.textCommands.set(alias.toLowerCase(), command);
    }
  }

  console.log(`Loaded text command: ${command.name}`);
}

const eventsPath = path.join(__dirname, 'events');

for (const filePath of loadJsFiles(eventsPath)) {
  const { default: event } = await import(pathToFileURL(filePath).href);

  if (!event?.name || !event?.execute) {
    console.warn(
      `Event at ${filePath} is missing required "name" or "execute" export.`,
    );
    continue;
  }

  const handler = (...args) => event.execute(...args, client);

  if (event.once) {
    client.once(event.name, handler);
  } else {
    client.on(event.name, handler);
  }

  console.log(`Registered event handler: ${event.name}`);
}

await connectDatabase();

client.login(token);

const disconnectGracefully = async () => {
  if (!client.isReady()) {
    await disconnectDatabase();
    process.exit(0);
    return;
  }

  console.log('Shutting down Discord client...');
  await client.destroy();
  await disconnectDatabase();
  process.exit(0);
};

process.on('SIGINT', disconnectGracefully);
process.on('SIGTERM', disconnectGracefully);
