import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import {
  buildInfoEmbed,
  buildWarningEmbed,
} from '../utils/embed.js';

const buildComponentRow = (disabled = true) =>
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('update_disabled')
      .setLabel('Updates Disabled')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled),
  );

const createNoopCollector = () => ({
  on: () => {},
  stop: () => {},
});

export const initiateUpdateWorkflow = async ({
  sourceLabel,
  requester,
  sendMessage,
  summary,
}) => {
  const requesterTag = requester?.tag ?? 'System';

  const introEmbed = buildInfoEmbed({
    title: 'Repository Updates Disabled',
    description: [
      summary ??
        `Update requested by **${requesterTag}**, but automatic repository updates are currently disabled.`,
      'Re-enable updates in the configuration to allow pull operations.',
    ].join('\n'),
    footer: {
      text: sourceLabel,
    },
  });

  const message = await sendMessage({
    embeds: [introEmbed],
    components: [buildComponentRow()],
    allowedMentions: { parse: [] },
  });

  const collector = createNoopCollector();

  setTimeout(() => {
    const timeoutEmbed = buildWarningEmbed({
      title: 'No Action Taken',
      description: 'Updates remain disabled. No repository changes were made.',
      footer: {
        text: sourceLabel,
      },
    });

    message.edit({
      embeds: [timeoutEmbed],
      components: [buildComponentRow()],
      allowedMentions: { parse: [] },
    }).catch(() => {});
  }, 2_000);

  return { message, collector };
};
