import {
  PermissionsBitField,
  SlashCommandBuilder,
} from 'discord.js';
import {
  getDefaultPrefix,
  getGuildPrefix,
  getGuildSettings,
} from '../services/guildSettingsService.js';
import { buildErrorEmbed } from '../utils/embed.js';
import {
  buildSessionPayloadFromSession,
  createPrefixSessionState,
  endPrefixSession,
  registerPrefixSession,
  scheduleSessionExpiry,
} from '../features/prefix/prefixSessionManager.js';

const requiresManageGuild = PermissionsBitField.Flags.ManageGuild;

const buildPermissionError = () =>
  buildErrorEmbed({
    description: 'You need the **Manage Server** permission to manage the bot prefix.',
  });

export default {
  data: new SlashCommandBuilder()
    .setName('prefix')
    .setDescription('View or update the bot prefix for this server.')
    .setDefaultMemberPermissions(requiresManageGuild),
  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply({
        embeds: [
          buildErrorEmbed({
            description: 'Server prefixes can only be managed inside a Discord server.',
          }),
        ],
        ephemeral: true,
      });
      return;
    }

    const isOwner = interaction.guild.ownerId === interaction.user.id;
    const hasPermission =
      isOwner ||
      interaction.memberPermissions?.has(requiresManageGuild) ||
      false;

    if (!hasPermission) {
      await interaction.reply({
        embeds: [buildPermissionError()],
        ephemeral: true,
      });
      return;
    }

    const defaultPrefix =
      interaction.client?.defaultPrefix ?? getDefaultPrefix();

    const [settings, currentPrefix] = await Promise.all([
      getGuildSettings(interaction.guildId),
      getGuildPrefix(interaction.guildId),
    ]);

    const session = createPrefixSessionState({
      guildId: interaction.guildId,
      requestedById: interaction.user.id,
      requestedByTag: interaction.user.tag,
      defaultPrefix,
      currentPrefix,
      settings,
    });

    const responsePayload = buildSessionPayloadFromSession(session, 'view', {
      expired: false,
    });

    const sentMessage = await interaction.reply({
      ...responsePayload,
      fetchReply: true,
      allowedMentions: { parse: [] },
    });

    session.message = sentMessage;
    session.channel = sentMessage.channel ?? interaction.channel ?? null;
    registerPrefixSession(sentMessage.id, session);

    if (!scheduleSessionExpiry(session, sentMessage.id)) {
      const expiryPayload = buildSessionPayloadFromSession(session, 'expired', {
        expired: true,
      });

      await sentMessage.edit(expiryPayload).catch((error) => {
        console.error('Failed to finalize prefix controls:', error);
      });

      endPrefixSession(sentMessage.id);
    }
  },
};
