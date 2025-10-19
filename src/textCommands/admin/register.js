import { isSuperuser } from '../../services/roleService.js';
import { buildErrorEmbed } from '../../utils/embed.js';
import { initiateDeployCommandsWorkflow } from '../../workflows/deployCommandsWorkflow.js';

export default {
  name: 'register',
  description: 'Register slash commands globally or for the current guild.',
  aliases: ['deploycommands'],
  usage: '',
  async execute(message) {
    const hasAccess = await isSuperuser(message.author.id);

    if (!hasAccess) {
      const embed = buildErrorEmbed({
        description: 'Only superusers can register slash commands.',
      });
      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
      return;
    }

    await initiateDeployCommandsWorkflow({
      client: message.client,
      requester: message.author,
      guildName: message.guild?.name,
      contextLabel: `Text command triggered by ${message.author.tag}`,
      sendMessage: (payload) =>
        message.reply({
          ...payload,
          allowedMentions: { repliedUser: false, parse: [] },
        }),
    });
  },
};
