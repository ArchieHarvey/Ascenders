import { isSuperuser } from '../services/roleService.js';
import { buildErrorEmbed, buildWarningEmbed } from '../utils/embed.js';

export default {
  name: 'shutdown',
  description: 'Shut down the bot (superusers only).',
  aliases: [],
  usage: '',
  async execute(message) {
    const allowed = await isSuperuser(message.author.id);

    if (!allowed) {
      const embed = buildErrorEmbed({
        description: 'Only superusers can shut down the bot.',
      });
      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false, parse: [] },
      });
      return;
    }

    const embed = buildWarningEmbed({
      title: 'Shutdown initiated',
      description: 'The bot is shutting down now.',
    });

    await message.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false, parse: [] },
    });

    setTimeout(() => {
      process.exit(0);
    }, 1000);
  },
};
