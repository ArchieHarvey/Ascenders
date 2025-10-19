import { isSuperuser } from '../services/roleService.js';
import { initiateUpdateWorkflow } from '../workflows/updateWorkflow.js';
import { buildErrorEmbed, buildInfoEmbed } from '../utils/embed.js';

export default {
  name: 'update',
  description: 'Request a repository update via git pull.',
  aliases: ['deploy'],
  usage: '',
  async execute(message) {
    const hasAccess = await isSuperuser(message.author.id);

    if (!hasAccess) {
      const embed = buildErrorEmbed({
        description: 'Only superusers can request repository updates.',
      });
      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
      return;
    }

    const infoEmbed = buildInfoEmbed({
      title: 'Update Requested',
      description: 'Preparing confirmation workflow in this channel…',
    });

    await message.reply({
      embeds: [infoEmbed],
      allowedMentions: { repliedUser: false },
    });

    await initiateUpdateWorkflow({
      sourceLabel: `Initiated via text command by ${message.author.tag}`,
      requester: message.author,
      sendMessage: (payload) =>
        message.channel.send({
          ...payload,
          allowedMentions: { repliedUser: false, parse: [] },
        }),
    });
  },
};
