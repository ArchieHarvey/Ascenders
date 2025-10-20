import { Events } from 'discord.js';
import { buildErrorEmbed } from '../utils/embed.js';
import {
  handleGitAutoPullButtonInteraction,
  isGitAutoPullButtonInteraction,
} from '../jobs/gitAutoPullJob.js';
import {
  handlePrefixButtonInteraction,
  isPrefixButtonInteraction,
} from '../features/prefix/prefixSessionManager.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isButton()) {
      if (isGitAutoPullButtonInteraction(interaction)) {
        await handleGitAutoPullButtonInteraction(interaction);
        return;
      }

      if (isPrefixButtonInteraction(interaction)) {
        await handlePrefixButtonInteraction(interaction);
        return;
      }

      return;
    }

    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No slash command handler found for ${interaction.commandName}.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing slash command ${interaction.commandName}:`, error);

      const embed = buildErrorEmbed({
        description: 'Something went wrong while executing that command.',
      });

      const response = {
        embeds: [embed],
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(response);
      } else {
        await interaction.reply(response);
      }
    }
  },
};
