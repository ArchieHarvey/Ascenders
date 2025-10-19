import { SlashCommandBuilder } from 'discord.js';
import { buildInfoEmbed, buildErrorEmbed } from '../utils/embed.js';
import { formatDuration } from '../utils/time.js';

export default {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Show how long the bot has been running.'),
  async execute(interaction) {
    try {
      const uptimeMs =
        typeof interaction.client.uptime === 'number'
          ? interaction.client.uptime
          : Math.round(process.uptime() * 1000);

      const embed = buildInfoEmbed({
        title: 'Bot uptime',
        fields: [
          {
            name: 'Uptime',
            value: formatDuration(uptimeMs),
            inline: true,
          },
          {
            name: 'Since',
            value: `<t:${Math.floor((Date.now() - uptimeMs) / 1000)}:R>`,
            inline: true,
          },
        ],
      });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Failed to handle /uptime command:', error);

      const embed = buildErrorEmbed({
        description: 'Unable to read uptime right now. Please try again later.',
      });

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ embeds: [embed], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }
  },
};
