import { buildInfoEmbed, buildErrorEmbed } from '../../utils/embed.js';
import { formatDuration } from '../../utils/time.js';

export default {
  name: 'uptime',
  description: 'Show how long the bot has been running.',
  aliases: [],
  usage: '',
  async execute(message) {
    try {
      const uptimeMs =
        typeof message.client.uptime === 'number'
          ? message.client.uptime
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

      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false, parse: [] },
      });
    } catch (error) {
      console.error('Failed to handle uptime text command:', error);
      const embed = buildErrorEmbed({
        description: 'Unable to read uptime right now. Please try again later.',
      });

      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false, parse: [] },
      });
    }
  },
};
