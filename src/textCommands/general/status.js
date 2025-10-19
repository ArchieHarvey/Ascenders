import { PermissionsBitField } from 'discord.js';
import {
  getOrCreateStatus,
  updateStatus,
} from '../../services/botStatusService.js';
import {
  activityKeys,
  applyBotPresence,
  resolveActivityKey,
} from '../../utils/presence.js';
import {
  buildErrorEmbed,
  buildInfoEmbed,
  buildSuccessEmbed,
} from '../../utils/embed.js';

const formatActivity = (key) =>
  key.charAt(0) + key.slice(1).toLowerCase();

const requiresManageGuild = PermissionsBitField.Flags.ManageGuild;

export default {
  name: 'status',
  description: 'View or update the bot status.',
  usage: '[view|set <activity?> <message>]',
  aliases: [],
  async execute(message, args) {
    const [firstArg] = args;

    if (!firstArg || firstArg.toLowerCase() === 'view') {
      const status = await getOrCreateStatus();
      const updatedAt = status.updatedAt
        ? `<t:${Math.floor(status.updatedAt.getTime() / 1000)}:R>`
        : 'N/A';
      const updatedBy = status.lastUpdatedByTag ?? 'Unknown';

      const embed = buildInfoEmbed({
        title: 'Bot Status',
        fields: [
          { name: 'Message', value: status.message },
          { name: 'Activity', value: formatActivity(status.activityType), inline: true },
          { name: 'Last Updated', value: `${updatedAt} by \`${updatedBy}\`` },
        ],
      });

      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
      return;
    }

    if (firstArg.toLowerCase() !== 'set') {
      const embed = buildErrorEmbed({
        description:
          'Unknown subcommand. Use `view` to check the current status or `set` to update it.',
      });
      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
      return;
    }

    const member = message.member;
    const isOwner = message.guild?.ownerId === message.author.id;
    const hasPermission =
      isOwner ||
      member?.permissions?.has(requiresManageGuild) ||
      false;

    if (!hasPermission) {
      const embed = buildErrorEmbed({
        description:
          'You need the **Manage Server** permission to update the bot status.',
      });
      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
      return;
    }

    const remainingArgs = args.slice(1);
    const potentialActivity = remainingArgs[0];
    const activityKey = resolveActivityKey(potentialActivity);

    if (activityKey) {
      remainingArgs.shift();
    }

    const messageText = remainingArgs.join(' ').trim();

    if (!messageText) {
      const activities = activityKeys
        .map((key) => formatActivity(key))
        .join(', ');

      const embed = buildErrorEmbed({
        description: [
          'Please provide a status message.',
          `Usage: \`${message.client.prefix}status set [activity] <message>\``,
          `Activities: ${activities}`,
        ].join('\n'),
      });

      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
      return;
    }

    if (messageText.length > 120) {
      const embed = buildErrorEmbed({
        description: 'Please provide a message shorter than 120 characters.',
      });
      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
      return;
    }

    const updatedStatus = await updateStatus({
      message: messageText,
      activityType: activityKey ?? undefined,
      userId: message.author.id,
      userTag: message.author.tag,
    });

    applyBotPresence(message.client, updatedStatus);

    const embed = buildSuccessEmbed({
      title: 'Status Updated',
      fields: [
        { name: 'Message', value: updatedStatus.message },
        {
          name: 'Activity',
          value: formatActivity(updatedStatus.activityType),
          inline: true,
        },
      ],
    });

    await message.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false },
    });
  },
};
