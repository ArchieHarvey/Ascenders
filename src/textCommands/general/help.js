import { buildInfoEmbed } from '../../utils/embed.js';
import {
  getDefaultPrefix,
  getGuildPrefix,
} from '../../services/guildSettingsService.js';

export default {
  name: 'help',
  description: 'Display information about available text commands.',
  aliases: ['commands'],
  async execute(message) {
    let prefix = message.client?.defaultPrefix ?? getDefaultPrefix();

    if (message.guildId) {
      try {
        prefix = await getGuildPrefix(message.guildId);
      } catch (error) {
        console.error('Failed to resolve guild prefix for help command:', error);
      }
    }
    const uniqueCommands = [...new Set(message.client.textCommands.values())];

    const lines = uniqueCommands.map((command) => {
      const usage = command.usage ? ` ${command.usage}` : '';
      return `• \`${prefix}${command.name}${usage}\` — ${
        command.description ?? 'No description provided.'
      }`;
    });

    const description =
      lines.length > 0
        ? `Here are the available text commands:\n${lines.join('\n')}`
        : 'No text commands are currently loaded.';

    const embed = buildInfoEmbed({
      title: 'Command Reference',
      description,
      footer: {
        text: `Commands accept the prefix "${prefix}" or a direct mention.`,
      },
    });

    await message.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false },
    });
  },
};
