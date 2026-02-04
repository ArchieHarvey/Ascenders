import { logger } from '../services/logger.js';

export default {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = interaction.client.commands?.get(interaction.commandName);

    if (!command) {
      logger.warn(`No command handler registered for ${interaction.commandName}.`);
      await interaction.reply({
        content: 'Command not found.',
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error(
        `Error executing ${interaction.commandName}: ${error instanceof Error ? error.message : String(error)}`,
      );
      const reply = {
        content: 'There was an error while executing this command.',
        ephemeral: true,
      };

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  },
};
