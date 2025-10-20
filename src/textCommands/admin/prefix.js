import { PermissionsBitField } from 'discord.js';
import {
  getDefaultPrefix,
  getGuildPrefix,
  getGuildSettings,
} from '../../services/guildSettingsService.js';
import { buildErrorEmbed } from '../../utils/embed.js';
import {
  buildSessionPayloadFromSession,
  createPrefixSessionState,
  endPrefixSession,
  registerPrefixSession,
  scheduleSessionExpiry,
} from '../../features/prefix/prefixSessionManager.js';

const requiresManageGuild = PermissionsBitField.Flags.ManageGuild;

const reply = (message, payload) =>
  message.reply({
    ...payload,
    allowedMentions: { repliedUser: false, parse: [] },
  });


export default {
  name: 'prefix',
  description: 'View or update the bot prefix for this server.',
  aliases: [],
  usage: '',
  async execute(message) {
    if (!message.guild) {
      await reply(message, {
        embeds: [
          buildErrorEmbed({
            description: 'Server prefixes can only be managed inside a Discord server.',
          }),
        ],
      });
      return;
    }

    const member = message.member;
    const isOwner = message.guild.ownerId === message.author.id;
    const hasPermission =
      isOwner || member?.permissions?.has(requiresManageGuild) || false;

    if (!hasPermission) {
      await reply(message, {
        embeds: [
          buildErrorEmbed({
            description:
              'You need the **Manage Server** permission to manage the bot prefix.',
          }),
        ],
      });
      return;
    }

    const defaultPrefix = message.client?.defaultPrefix ?? getDefaultPrefix();

    const [settings, currentPrefix] = await Promise.all([
      getGuildSettings(message.guildId),
      getGuildPrefix(message.guildId),
    ]);

    const session = createPrefixSessionState({
      guildId: message.guildId,
      requestedById: message.author.id,
      requestedByTag: message.author.tag,
      defaultPrefix,
      currentPrefix,
      settings,
    });

    const responsePayload = buildSessionPayloadFromSession(session, 'view', {
      expired: false,
    });

    const sentMessage = await reply(message, responsePayload);

    session.message = sentMessage;
    session.channel = sentMessage.channel ?? null;
    registerPrefixSession(sentMessage.id, session);

    if (!scheduleSessionExpiry(session, sentMessage.id)) {
      const expiryPayload = buildSessionPayloadFromSession(session, 'expired', {
        expired: true,
      });

      sentMessage.edit(expiryPayload).catch((error) => {
        console.error('Failed to finalize prefix controls:', error);
      });

      endPrefixSession(sentMessage.id);
    }
  },
};

export {
  handlePrefixButtonInteraction,
  isPrefixButtonInteraction,
} from '../../features/prefix/prefixSessionManager.js';
