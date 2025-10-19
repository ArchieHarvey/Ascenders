import { randomUUID } from 'node:crypto';
import {
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

    const requestId = randomUUID();

    const promptEmbed = buildWarningEmbed({
      title: 'Confirm Restart',
      description:
        'Restarting will briefly disconnect the bot. Confirm to proceed or cancel to abort.',
    });

    const promptMessage = await message.reply({
      embeds: [promptEmbed],
      components: [buildRow(requestId)],
      allowedMentions: { repliedUser: false, parse: [] },
    });

    const collector = promptMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 30_000,
    });

    collector.on('collect', async (interaction) => {
      if (!interaction.customId.endsWith(requestId)) {
        return;
      }

      const buttonAllowed = await isSuperuser(interaction.user.id);
      if (!buttonAllowed) {
        await interaction.reply({
          embeds: [
            buildErrorEmbed({
              description: 'Only superusers can manage restart confirmations.',
            }),
          ],
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      if (interaction.user.id !== message.author.id) {
        await interaction.reply({
          embeds: [
            buildErrorEmbed({
              description: 'Only the original requester can use these buttons.',
            }),
          ],
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      if (interaction.customId.startsWith('restart_confirm_')) {
        collector.stop('confirm');
        await interaction.update({
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

      if (interaction.customId.startsWith('restart_cancel_')) {
        collector.stop('cancel');
        await interaction.update({
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
        await promptMessage.edit({
          embeds: [
            buildWarningEmbed({
              title: 'Restart request timed out',
              description: 'No action was taken within 30 seconds.',
            }),
          ],
          components: [buildRow(requestId, true)],
        });
      } catch (error) {
        console.warn('Failed to finalize restart prompt message:', error);
      }
    });
  },
};
