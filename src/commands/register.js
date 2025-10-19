import { SlashCommandBuilder } from 'discord.js';
import { isSuperuser } from '../services/roleService.js';
import { buildErrorEmbed } from '../utils/embed.js';
import { initiateDeployCommandsWorkflow } from '../workflows/deployCommandsWorkflow.js';

export default {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register slash commands globally or for the current guild.'),
  async execute(interaction) {
    const hasAccess = await isSuperuser(interaction.user.id);

    if (!hasAccess) {
      const embed = buildErrorEmbed({
        description: 'Only superusers can register slash commands.',
      });
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    await initiateDeployCommandsWorkflow({
      client: interaction.client,
      requester: interaction.user,
      guildName: interaction.guild?.name,
      contextLabel: `Slash command triggered by ${interaction.user.tag}`,
      sendMessage: (payload) =>
        interaction.reply({
          ...payload,
          fetchReply: true,
        }),
    });
  },
};
