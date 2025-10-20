import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import {
  buildLoggingSessionPayload,
  createLoggingSessionState,
  registerLoggingSession,
  scheduleLoggingSessionExpiry,
} from '../features/logging/loggingSessionManager.js';
import { buildErrorEmbed } from '../utils/embed.js';

const requiresManageGuild = PermissionsBitField.Flags.ManageGuild;

export default {
  data: new SlashCommandBuilder()
    .setName('logging')
    .setDescription('Open the logging control panel.')
    .setDefaultMemberPermissions(requiresManageGuild),
  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply({
        embeds: [
          buildErrorEmbed({
            description:
              'Server logging can only be managed inside a Discord server.',
          }),
        ],
        ephemeral: true,
      });
      return;
    }

    const member = await interaction.guild.members.fetch(interaction.user.id);
    const isOwner = interaction.guild.ownerId === interaction.user.id;
    const hasPermission =
      isOwner || member.permissions.has(requiresManageGuild);

    if (!hasPermission) {
      await interaction.reply({
        embeds: [
          buildErrorEmbed({
            description:
              'You need the **Manage Server** permission to manage logging.',
          }),
        ],
        ephemeral: true,
      });
      return;
    }

    try {
      const session = await createLoggingSessionState({
        guildId: interaction.guildId,
        requestedById: interaction.user.id,
        requestedByTag: interaction.user.tag,
      });

      const payload = buildLoggingSessionPayload(session, interaction.guild);

      const sentMessage = await interaction.reply({
        ...payload,
        fetchReply: true,
        ephemeral: true,
      });

      session.message = sentMessage;
      registerLoggingSession(sentMessage.id, session);

      if (!scheduleLoggingSessionExpiry(session, sentMessage.id)) {
        const expiredPayload = buildLoggingSessionPayload(
          session,
          interaction.guild,
          { expired: true },
        );
        await sentMessage.edit(expiredPayload);
      }
    } catch (error) {
      console.error('Failed to open logging session:', error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({
          embeds: [
            buildErrorEmbed({
              description:
                error?.message ??
                'Unable to open the logging control panel right now.',
            }),
          ],
        });
      } else {
        await interaction.reply({
          embeds: [
            buildErrorEmbed({
              description:
                error?.message ??
                'Unable to open the logging control panel right now.',
            }),
          ],
          ephemeral: true,
        });
      }
    }
  },
};
