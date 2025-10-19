import { SlashCommandBuilder } from 'discord.js';
import { isSuperuser } from '../services/roleService.js';
import { buildErrorEmbed, buildInfoEmbed } from '../utils/embed.js';
import { initiateUpdateWorkflow } from '../workflows/updateWorkflow.js';

export default {
  data: new SlashCommandBuilder()
    .setName('update')
    .setDescription('Request a repository update via git pull.'),
  async execute(interaction) {
    const hasAccess = await isSuperuser(interaction.user.id);

    if (!hasAccess) {
      const embed = buildErrorEmbed({
        description: 'Only superusers can request repository updates.',
      });
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const infoEmbed = buildInfoEmbed({
      title: 'Update Requested',
      description: 'Preparing confirmation workflow in this channel…',
    });

    await interaction.reply({ embeds: [infoEmbed], ephemeral: true });

    await initiateUpdateWorkflow({
      sourceLabel: `Initiated via slash command by ${interaction.user.tag}`,
      requester: interaction.user,
      sendMessage: (payload) =>
        interaction.channel.send({
          ...payload,
        }),
    });
  },
};
