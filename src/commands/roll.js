import { SlashCommandBuilder } from 'discord.js';
import { buildInfoEmbed } from '../utils/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a die and get a lucky number!')
    .addIntegerOption((option) =>
      option
        .setName('sides')
        .setDescription('Number of sides on the die (default 6)')
        .setMinValue(2),
    ),
  async execute(interaction) {
    const sides = interaction.options.getInteger('sides') ?? 6;
    const result = Math.floor(Math.random() * sides) + 1;

    const embed = buildInfoEmbed({
      title: 'Dice Roll',
      description: `You rolled a **${result}** on a **${sides}**-sided die.`,
    });

    await interaction.reply({ embeds: [embed] });
  },
};
