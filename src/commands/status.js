import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import {
  getOrCreateStatus,
  updateStatus,
} from '../services/botStatusService.js';
import {
  activityKeys,
  applyBotPresence,
  resolveActivityKey,
} from '../utils/presence.js';
import {
  buildErrorEmbed,
  buildInfoEmbed,
  buildSuccessEmbed,
} from '../utils/embed.js';

const toChoiceName = (key) =>
  key.charAt(0) + key.slice(1).toLowerCase();

const buildCommand = () => {
  const command = new SlashCommandBuilder()
    .setName('status')
    .setDescription('View or update the bot status.')
    .addSubcommand((subcommand) =>
      subcommand.setName('view').setDescription('View the current bot status.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Update the bot status.')
        .addStringOption((stringOption) =>
          stringOption
            .setName('message')
            .setDescription('Status message for the bot presence.')
            .setMaxLength(120)
            .setRequired(true),
        )
        .addStringOption((activityOption) => {
          activityOption
            .setName('activity')
            .setDescription('Activity type for the presence.');

          for (const key of activityKeys) {
            activityOption.addChoices({
              name: toChoiceName(key),
              value: key,
            });
          }

          return activityOption;
        }),
    );

  return command;
};

export default {
  data: buildCommand(),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'view') {
      const status = await getOrCreateStatus();
      const updatedAt = status.updatedAt
        ? `<t:${Math.floor(status.updatedAt.getTime() / 1000)}:R>`
        : 'N/A';
      const updatedBy = status.lastUpdatedByTag ?? 'Unknown';

      const embed = buildInfoEmbed({
        title: 'Bot Status',
        fields: [
          { name: 'Message', value: status.message },
          { name: 'Activity', value: toChoiceName(status.activityType), inline: true },
          { name: 'Last Updated', value: `${updatedAt} by ${updatedBy}`, inline: true },
        ],
      });

      await interaction.reply({ embeds: [embed] });
      return;
    }

    if (subcommand === 'set') {
      if (!interaction.inGuild()) {
        const embed = buildErrorEmbed({
          description: 'This command can only be used within a server.',
        });
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const guildOwnerId = interaction.guild?.ownerId;
      const hasPermission =
        interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild) ??
        false;
      const isOwner = guildOwnerId && interaction.user.id === guildOwnerId;

      if (!hasPermission && !isOwner) {
        const embed = buildErrorEmbed({
          description:
            'You need the **Manage Server** permission to update the bot status.',
        });
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const message = interaction.options.getString('message', true).trim();
      const activityInput = interaction.options.getString('activity');
      const activityKey = resolveActivityKey(activityInput) ?? undefined;

      const updatedStatus = await updateStatus({
        message,
        activityType: activityKey,
        userId: interaction.user.id,
        userTag: interaction.user.tag,
      });

      applyBotPresence(interaction.client, updatedStatus);

      const embed = buildSuccessEmbed({
        title: 'Status Updated',
        fields: [
          { name: 'Message', value: updatedStatus.message },
          {
            name: 'Activity',
            value: toChoiceName(updatedStatus.activityType),
            inline: true,
          },
        ],
      });

      await interaction.reply({ embeds: [embed] });
    }
  },
};
