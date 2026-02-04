import { SlashCommandBuilder } from "discord.js";
import { config } from "../config/index.js";

const isOwner = (userId) => {
  if (config.ownerIds.length === 0) {
    return true;
  }
  return config.ownerIds.includes(userId);
};

export const updateCommand = {
  data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Check for updates or apply them.")
    .addSubcommand((subcommand) =>
      subcommand.setName("check").setDescription("Check for remote updates.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("apply")
        .setDescription("Apply update and restart the bot.")
        .addBooleanOption((option) =>
          option
            .setName("confirm")
            .setDescription("Confirm applying the update.")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const updater = interaction.client.gitUpdater;

    if (!updater) {
      await interaction.reply({
        content: "Updater is not configured.",
        ephemeral: true,
      });
      return;
    }

    if (!isOwner(interaction.user.id)) {
      await interaction.reply({
        content: "You are not authorized to run updates.",
        ephemeral: true,
      });
      return;
    }

    if (subcommand === "check") {
      const result = await updater.checkNow();
      if (result.error) {
        await interaction.reply({
          content: "Failed to check for updates. See logs for details.",
          ephemeral: true,
        });
        return;
      }

      const status = result.hasUpdate
        ? `Update available: ${result.upstreamSha}`
        : "No updates available.";

      await interaction.reply({ content: status, ephemeral: true });
      return;
    }

    if (subcommand === "apply") {
      const confirm = interaction.options.getBoolean("confirm");
      if (!confirm) {
        await interaction.reply({
          content: "Confirmation is required to apply updates.",
          ephemeral: true,
        });
        return;
      }

      const result = await updater.checkNow();
      if (!result.hasUpdate) {
        await interaction.reply({
          content: "No updates available to apply.",
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: "Applying update. The bot will restart if your process manager is configured.",
        ephemeral: true,
      });

      await updater.applyUpdate();
      process.exit(0);
    }
  },
};
