import { randomUUID } from 'node:crypto';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { isSuperuser } from '../services/roleService.js';
import { pullLatestFromRepo } from '../services/updateService.js';
import {
  buildErrorEmbed,
  buildInfoEmbed,
  buildSuccessEmbed,
  buildWarningEmbed,
} from '../utils/embed.js';

const buildComponentRow = (requestId, disabled = false) =>
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`update_confirm_${requestId}`)
      .setLabel('Confirm')
      .setStyle(ButtonStyle.Success)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId(`update_cancel_${requestId}`)
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled),
  );

const buildSuccessDetails = (result) => {
  const parts = [
    `**Path:** \`${result.path}\``,
    result.repo?.fullName
      ? `**Repository:** \`${result.repo.fullName}\` (ref \`${result.repo.ref}\`)`
      : null,
    result.commit?.sha
      ? result.commit?.htmlUrl
        ? `**Commit:** [\`${result.commit.sha}\`](${result.commit.htmlUrl})`
        : `**Commit:** \`${result.commit.sha}\``
      : null,
    result.commit?.message ? `**Message:** ${result.commit.message}` : null,
    result.commit?.authorName
      ? `**Author:** ${result.commit.authorName}${
          result.commit.authorEmail ? ` (<${result.commit.authorEmail}>)` : ''
        }`
      : null,
    result.commit?.committedAt
      ? `**Committed at:** ${result.commit.committedAt}`
      : null,
    result.previousCommit
      ? `**Previous commit:** \`${result.previousCommit}\``
      : null,
    result.compareUrl ? `**Compare:** ${result.compareUrl}` : null,
    `**Files written:** ${result.filesWritten}`,
    `**Directories created:** ${result.directoriesCreated}`,
    `**Entries removed:** ${result.removedEntries}`,
    result.preserved?.length
      ? `**Preserved paths:** ${result.preserved.join(', ')}`
      : null,
  ];

  return parts.filter(Boolean).join('\n\n');
};

const buildErrorDetails = (error) => {
  const parts = [
    `\`${error.message ?? 'Unknown error'}\``,
    error.url ? `Request URL: ${error.url}` : null,
    error.status
      ? `HTTP status: ${error.status} ${error.statusText ?? ''}`.trim()
      : null,
  ];

  return parts.filter(Boolean).join('\n');
};

export const initiateUpdateWorkflow = async ({
  sourceLabel,
  requester,
  sendMessage,
  summary,
}) => {
  const requestId = randomUUID();

  const requesterTag = requester?.tag ?? 'System';

  const introEmbed = buildInfoEmbed({
    title: 'Repository Update Requested',
    description: [
      summary ?? `A repository update has been requested by **${requesterTag}**.`,
      'Press **Confirm** to download and apply the latest code from GitHub, or **Cancel** to abort.',
      'Only superusers can act on the buttons.',
    ].join('\n'),
    footer: {
      text: sourceLabel,
    },
  });

  const message = await sendMessage({
    embeds: [introEmbed],
    components: [buildComponentRow(requestId)],
    allowedMentions: { parse: [] },
  });

  const collector = message.createMessageComponentCollector({
    time: 60_000,
  });

  collector.on('collect', async (interaction) => {
    if (!interaction.customId.endsWith(requestId)) {
      return;
    }

    const customId = interaction.customId;

    const hasAccess = await isSuperuser(interaction.user.id);

    if (!hasAccess) {
      const embed = buildErrorEmbed({
        description: 'Only superusers can use these buttons.',
      });
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (customId.startsWith('update_confirm_')) {
      collector.stop('confirmed');
      await interaction.deferUpdate();

      const runningEmbed = buildInfoEmbed({
        title: 'Update In Progress',
        description: 'Downloading repository archive... please wait.',
      });

      await message.edit({
        embeds: [runningEmbed],
        components: [buildComponentRow(requestId, true)],
        allowedMentions: { parse: [] },
      });

      try {
        const result = await pullLatestFromRepo();

        const successEmbed = buildSuccessEmbed({
          title: 'Repository Update Complete',
          description: buildSuccessDetails(result),
          footer: {
            text: `Confirmed by ${interaction.user.tag}`,
          },
        });

        await message.edit({
          embeds: [successEmbed],
          components: [buildComponentRow(requestId, true)],
          allowedMentions: { parse: [] },
        });
      } catch (error) {
        const errorEmbed = buildErrorEmbed({
          title: 'Repository Update Failed',
          description: buildErrorDetails(error),
          footer: {
            text: `Confirmed by ${interaction.user.tag}`,
          },
        });

        await message.edit({
          embeds: [errorEmbed],
          components: [buildComponentRow(requestId, true)],
          allowedMentions: { parse: [] },
        });
      }

      return;
    }

    if (customId.startsWith('update_cancel_')) {
      collector.stop('cancelled');
      await interaction.deferUpdate();

      const cancelEmbed = buildInfoEmbed({
        title: 'Repository Update Cancelled',
        description: `Request cancelled by **${interaction.user.tag}**.`,
      });

      await message.edit({
        embeds: [cancelEmbed],
        components: [buildComponentRow(requestId, true)],
        allowedMentions: { parse: [] },
      });
    }
  });

  collector.on('end', async (_, reason) => {
    if (reason === 'time') {
      const timeoutEmbed = buildWarningEmbed({
        title: 'Repository Update Timed Out',
        description:
          'No superuser confirmed the update within 60 seconds. Please run the command again if needed.',
      });

      await message.edit({
        embeds: [timeoutEmbed],
        components: [buildComponentRow(requestId, true)],
        allowedMentions: { parse: [] },
      });
    }
  });

  return { message, collector };
};
