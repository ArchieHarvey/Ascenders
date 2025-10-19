import { SlashCommandBuilder } from 'discord.js';
import { isSuperuser } from '../services/roleService.js';
import { buildErrorEmbed, buildWarningEmbed } from '../utils/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Shut down the bot (superusers only).'),
  async execute(interaction) {
    try {
      const allowed = await isSuperuser(interaction.user.id);

      if (!allowed) {
        const embed = buildErrorEmbed({
          description: 'Only superusers can shut down the bot.',
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const embed = buildWarningEmbed({
        title: 'Shutdown initiated',
        description: 'The bot is shutting down now.',
      });

      if (interaction.deferred) {
        await interaction.editReply({ embeds: [embed] });
      } else if (interaction.replied) {
        await interaction.followUp({ embeds: [embed] });
      } else {
        await interaction.reply({ embeds: [embed] });
      }

      setTimeout(() => {
        process.exit(0);
      }, 1000);
    } catch (error) {
      console.error('Failed to execute /shutdown command:', error);

      const embed = buildErrorEmbed({
        description: 'Something went wrong while trying to shut down the bot.',
      });

      if (interaction.deferred) {
        await interaction.editReply({ embeds: [embed], ephemeral: true });
      } else if (interaction.replied) {
        await interaction.followUp({ embeds: [embed], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }
  },
};
