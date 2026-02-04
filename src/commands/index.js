import { readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { logger } from '../services/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const loadCommands = async () => {
  const commandFiles = (await readdir(__dirname)).filter(
    (file) => file.endsWith('.js') && file !== 'index.js',
  );
  const commands = [];

  for (const file of commandFiles) {
    const fileUrl = pathToFileURL(join(__dirname, file));
    const commandModule = await import(fileUrl);
    const { data, execute } = commandModule;

    if (!data || typeof execute !== 'function') {
      logger.warn(`Skipping command file ${file} because it is missing required exports.`);
      continue;
    }

    commands.push({ data, execute });
  }

  return commands;
};
