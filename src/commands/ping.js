import { SlashCommandBuilder } from "discord.js";

export const pingCommand = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with pong."),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
