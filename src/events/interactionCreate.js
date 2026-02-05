import { commandMap } from "../commands/index.js";
import { logger } from "../services/logger.js";
import { EmbedBuilder } from "discord.js";

const errorEmbed = (description) =>
  new EmbedBuilder().setColor(0xd9534f).setDescription(description);

export const interactionCreateEvent = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isButton()) {
      const handled = await interaction.client.gitUpdater?.handleButtonInteraction(
        interaction
      );
      if (handled) {
        return;
      }
    }

    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = commandMap.get(interaction.commandName);
    if (!command) {
      await interaction.reply({
        embeds: [errorEmbed("Unknown command.")],
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error("Command execution failed.", { error: error?.message });
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          embeds: [errorEmbed("Something went wrong while running that command.")],
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          embeds: [errorEmbed("Something went wrong while running that command.")],
          ephemeral: true,
        });
      }
    }
  },
};
