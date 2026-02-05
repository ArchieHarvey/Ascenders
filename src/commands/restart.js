import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { config } from "../config/index.js";

const isOwner = (userId) => {
  if (config.ownerIds.length === 0) {
    return true;
  }
  return config.ownerIds.includes(userId);
};

const infoEmbed = (description) =>
  new EmbedBuilder().setColor(0x2b90d9).setDescription(description);

const errorEmbed = (description) =>
  new EmbedBuilder().setColor(0xd9534f).setDescription(description);

export const restartCommand = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restart the bot process.")
    .addBooleanOption((option) =>
      option
        .setName("confirm")
        .setDescription("Confirm restarting the bot.")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!isOwner(interaction.user.id)) {
      await interaction.reply({
        embeds: [errorEmbed("You are not authorized to restart the bot.")],
        ephemeral: true,
      });
      return;
    }

    const confirm = interaction.options.getBoolean("confirm");
    if (!confirm) {
      await interaction.reply({
        embeds: [errorEmbed("Confirmation is required to restart the bot.")],
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      embeds: [
        infoEmbed(
          "Restarting now. The bot will come back if your process manager is configured."
        ),
      ],
      ephemeral: true,
    });

    setTimeout(() => {
      process.exit(0);
    }, 250);
  },
};
