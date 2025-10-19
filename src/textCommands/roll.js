import { buildErrorEmbed, buildInfoEmbed } from '../utils/embed.js';

export default {
  name: 'roll',
  description: 'Roll a die, default 6 sides.',
  usage: '[sides]',
  aliases: ['dice'],
  async execute(message, args) {
    const sides = Number.parseInt(args[0], 10) || 6;

    if (Number.isNaN(sides) || sides < 2) {
      const embed = buildErrorEmbed({
        description: 'Please provide an integer greater than 1 for the number of sides.',
      });
      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
      return;
    }

    const result = Math.floor(Math.random() * sides) + 1;

    const embed = buildInfoEmbed({
      title: 'Dice Roll',
      description: `You rolled a **${result}** on a **${sides}**-sided die.`,
    });

    await message.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false },
    });
  },
};
