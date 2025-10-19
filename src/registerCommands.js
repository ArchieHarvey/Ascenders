import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { REST, Routes } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token) {
  console.error('Missing DISCORD_TOKEN in environment. Add it to your .env file.');
  process.exit(1);
}

if (!clientId) {
  console.error(
    'Missing DISCORD_CLIENT_ID in environment. You can find it in the Discord Developer Portal.',
  );
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath, { withFileTypes: true })
  .filter(
    (dirent) =>
      dirent.isFile() && dirent.name.toLowerCase().endsWith('.js'),
  )
  .map((dirent) => dirent.name);

const commands = [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const { default: command } = await import(pathToFileURL(filePath).href);

  if (!command?.data || !command?.execute) {
    console.warn(
      `Command at ${filePath} is missing required "data" or "execute" export.`,
    );
    continue;
  }

  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

const register = async () => {
  try {
    if (guildId) {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );
      console.log(
        `Successfully registered ${commands.length} command(s) for guild ${guildId}.`,
      );
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log(
        `Successfully registered ${commands.length} global command(s).`,
      );
      console.log(
        'Note: global command updates can take up to an hour to propagate.',
      );
    }
  } catch (error) {
    console.error('Failed to register application commands:', error);
    process.exitCode = 1;
  }
};

register();
