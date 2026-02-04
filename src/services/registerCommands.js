import { REST, Routes } from 'discord.js';
import { env } from '../config/env.js';
import { logger } from './logger.js';

export const registerCommands = async (commands) => {
  const rest = new REST({ version: '10' }).setToken(env.discordToken);
  const body = commands ?? [];

  try {
    await rest.put(Routes.applicationGuildCommands(env.clientId, env.guildId), {
      body,
    });
    logger.info(`Registered ${body.length} guild command${body.length === 1 ? '' : 's'}.`);
  } catch (error) {
    logger.error(
      `Failed to register commands: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
};
