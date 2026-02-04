import { env } from './config/env.js';
import { loadCommands } from './commands/index.js';
import { client, loadEvents } from './bot.js';
import { logger } from './services/logger.js';
import { registerCommands } from './services/registerCommands.js';

const start = async () => {
  const commands = await loadCommands();

  for (const command of commands) {
    client.commands.set(command.data.name, command);
  }

  const commandPayload = commands.map((command) => command.data.toJSON());
  await registerCommands(commandPayload);
  await loadEvents();
  await client.login(env.discordToken);
  logger.info('Discord client login initiated.');
  logger.info('Startup complete: events loaded and commands registered.');
};

start().catch((error) => {
  logger.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
