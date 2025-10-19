import { randomUUID } from 'node:crypto';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { isSuperuser } from '../services/roleService.js';
import { deploySlashCommands } from '../services/commandDeploymentService.js';
import {
  buildErrorEmbed,
  buildInfoEmbed,
  buildSuccessEmbed,
  buildWarningEmbed,
} from '../utils/embed.js';

const buildRow = (requestId, disabled = false) =>
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`deploy_global_${requestId}`)
      .setLabel('Register Global')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId(`deploy_guild_${requestId}`)
      .setLabel('Register Guild')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled),
  );

export const initiateDeployCommandsWorkflow = async ({
  client,
  requester,
  guildName,
  sendMessage,
  contextLabel,
}) => {
  const requestId = randomUUID();
  const requesterTag = requester?.tag ?? 'Unknown';
  const guildInfo = guildName ? ` (Guild: ${guildName})` : '';

  const introEmbed = buildInfoEmbed({
    title: 'Slash Command Registration',
    description: [
      `Requested by **${requesterTag}**${guildInfo}.`,
      'Choose **Register Global** to update commands everywhere, or **Register Guild** to update only the current server.',
      'Only superusers can press these buttons.',
    ].join('\n'),
    footer: {
      text: contextLabel ?? 'Manual deployment request',
    },
  });

  const message = await sendMessage({
    embeds: [introEmbed],
    components: [buildRow(requestId)],
    allowedMentions: { parse: [] },
    fetchReply: true,
  });

  const collector = message.createMessageComponentCollector({
    time: 60_000,
  });

  collector.on('collect', async (interaction) => {
    if (!interaction.customId.endsWith(requestId)) {
      return;
    }

    const hasAccess = await isSuperuser(interaction.user.id);

    if (!hasAccess) {
      const embed = buildErrorEmbed({
        description: 'Only superusers can perform command registration.',
      });
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (interaction.customId.startsWith('deploy_global_')) {
      collector.stop('global');
      await interaction.deferUpdate();

      const pendingEmbed = buildInfoEmbed({
        title: 'Registering Commands Globally',
        description: 'Publishing slash commands globally… this can take a few minutes to propagate.',
      });

      await message.edit({
        embeds: [pendingEmbed],
        components: [buildRow(requestId, true)],
        allowedMentions: { parse: [] },
      });

      try {
        const result = await deploySlashCommands(client);
        const successEmbed = buildSuccessEmbed({
          title: 'Global Registration Complete',
          description: `Registered **${result.commandCount}** command(s) globally.`,
          footer: {
            text: `Requested by ${interaction.user.tag}`,
          },
        });

        await message.edit({
          embeds: [successEmbed],
          components: [buildRow(requestId, true)],
          allowedMentions: { parse: [] },
        });
      } catch (error) {
        const embed = buildErrorEmbed({
          title: 'Global Registration Failed',
          description: `Error: \`${error.message ?? 'Unknown error'}\``,
        });

        await message.edit({
          embeds: [embed],
          components: [buildRow(requestId, true)],
          allowedMentions: { parse: [] },
        });
      }

      return;
    }

    if (interaction.customId.startsWith('deploy_guild_')) {
      collector.stop('guild');

      if (!interaction.guildId) {
        await interaction.reply({
          embeds: [
            buildErrorEmbed({
              description:
                'Guild registration is only available within a server channel.',
            }),
          ],
          ephemeral: true,
        });
        return;
      }

      await interaction.deferUpdate();

      const pendingEmbed = buildInfoEmbed({
        title: 'Registering Commands for Guild',
        description: `Deploying slash commands for guild \`${interaction.guildId}\`…`,
      });

      await message.edit({
        embeds: [pendingEmbed],
        components: [buildRow(requestId, true)],
        allowedMentions: { parse: [] },
      });

      try {
        const result = await deploySlashCommands(client, {
          guildId: interaction.guildId,
        });
        const successEmbed = buildSuccessEmbed({
          title: 'Guild Registration Complete',
          description: `Registered **${result.commandCount}** command(s) for guild \`${interaction.guildId}\`.`,
          footer: {
            text: `Requested by ${interaction.user.tag}`,
          },
        });

        await message.edit({
          embeds: [successEmbed],
          components: [buildRow(requestId, true)],
          allowedMentions: { parse: [] },
        });
      } catch (error) {
        const embed = buildErrorEmbed({
          title: 'Guild Registration Failed',
          description: `Error: \`${error.message ?? 'Unknown error'}\``,
        });

        await message.edit({
          embeds: [embed],
          components: [buildRow(requestId, true)],
          allowedMentions: { parse: [] },
        });
      }

      return;
    }
  });

  collector.on('end', async (_, reason) => {
    if (['global', 'guild'].includes(reason)) {
      return;
    }

    const timeoutEmbed = buildWarningEmbed({
      title: 'Registration Request Timed Out',
      description: 'No action was taken within 60 seconds. Run the command again if needed.',
    });

    await message.edit({
      embeds: [timeoutEmbed],
      components: [buildRow(requestId, true)],
      allowedMentions: { parse: [] },
    });
  });

  return { message, collector };
};
