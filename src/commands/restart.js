import { randomUUID } from 'node:crypto';
import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  MessageFlags,
} from 'discord.js';
import { isSuperuser } from '../services/roleService.js';
import {
  buildErrorEmbed,
  buildWarningEmbed,
  buildSuccessEmbed,
} from '../utils/embed.js';

const buildRow = (requestId, disabled = false) =>
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`restart_confirm_${requestId}`)
      .setLabel('Confirm restart')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId(`restart_cancel_${requestId}`)
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled),
  );

export default {
  data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Restart the bot (superusers only).'),
  async execute(interaction) {
    try {
      const allowed = await isSuperuser(interaction.user.id);

      if (!allowed) {
        const embed = buildErrorEmbed({
          description: 'Only superusers can restart the bot.',
        });

        await interaction.reply({
          embeds: [embed],
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const requestId = randomUUID();
      const promptEmbed = buildWarningEmbed({
        title: 'Confirm Restart',
        description:
          'Restarting will briefly disconnect the bot. Confirm to proceed or cancel to abort.',
      });

      const response = await interaction.reply({
        embeds: [promptEmbed],
        components: [buildRow(requestId)],
        flags: MessageFlags.Ephemeral,
        fetchReply: true,
      });

      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 30_000,
      });

      collector.on('collect', async (buttonInteraction) => {
        if (!buttonInteraction.customId.endsWith(requestId)) {
          return;
        }

        if (buttonInteraction.user.id !== interaction.user.id) {
          await buttonInteraction.reply({
            embeds: [
              buildErrorEmbed({
                description: 'Only the original requester can use these buttons.',
              }),
            ],
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        if (buttonInteraction.customId.startsWith('restart_confirm_')) {
          collector.stop('confirm');
          await buttonInteraction.update({
            embeds: [
              buildSuccessEmbed({
                title: 'Restart confirmed',
                description: `Restart requested by ${interaction.user.tag}. The bot will restart now.`,
              }),
            ],
            components: [buildRow(requestId, true)],
          });

          setTimeout(() => {
            process.exit(1);
          }, 1000);
          return;
        }

        if (buttonInteraction.customId.startsWith('restart_cancel_')) {
          collector.stop('cancel');
          await buttonInteraction.update({
            embeds: [
              buildWarningEmbed({
                title: 'Restart cancelled',
                description: 'Restart request has been cancelled.',
              }),
            ],
            components: [buildRow(requestId, true)],
          });
          return;
        }
      });

      collector.on('end', async (_, reason) => {
        if (['confirm', 'cancel'].includes(reason)) {
          return;
        }
        try {
          await response.edit({
            embeds: [
              buildWarningEmbed({
                title: 'Restart timed out',
                description: 'No action was taken within 30 seconds.',
              }),
            ],
            components: [buildRow(requestId, true)],
          });
        } catch (error) {
          console.warn('Failed to finalize restart prompt:', error);
        }
      });
    } catch (error) {
      console.error('Failed to execute /restart command:', error);

      const embed = buildErrorEmbed({
        description: 'Something went wrong while trying to restart the bot.',
      });

      if (interaction.deferred) {
        await interaction.editReply({ embeds: [embed] });
      } else if (interaction.replied) {
        await interaction.followUp({
          embeds: [embed],
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          embeds: [embed],
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
