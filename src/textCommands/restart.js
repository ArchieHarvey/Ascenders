import { isSuperuser } from '../services/roleService.js';
import { buildErrorEmbed, buildWarningEmbed } from '../utils/embed.js';

export default {
  name: 'restart',
  description: 'Restart the bot (superusers only).',
  aliases: [],
  usage: '',
  async execute(message) {
    const allowed = await isSuperuser(message.author.id);

    if (!allowed) {
      const embed = buildErrorEmbed({
        description: 'Only superusers can restart the bot.',
      });
      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false, parse: [] },
      });
      return;
    }

    const embed = buildWarningEmbed({
      title: 'Restart initiated',
      description: 'The bot is restarting now.',
    });

    await message.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false, parse: [] },
    });

    setTimeout(() => {
      process.exit(1);
    }, 1000);
  },
};
