import { PermissionsBitField } from 'discord.js';
import {
  buildLoggingSessionPayload,
  createLoggingSessionState,
  registerLoggingSession,
  scheduleLoggingSessionExpiry,
} from '../../features/logging/loggingSessionManager.js';
import { buildErrorEmbed } from '../../utils/embed.js';

const requiresManageGuild = PermissionsBitField.Flags.ManageGuild;

const reply = (message, payload) =>
  message.reply({
    ...payload,
    allowedMentions: { repliedUser: false, parse: [] },
  });

export default {
  name: 'logging',
  description: 'Open the logging control panel.',
  aliases: [],
  usage: '',
  async execute(message) {
    if (!message.guild) {
      await reply(message, {
        embeds: [
          buildErrorEmbed({
            description:
              'Server logging can only be managed inside a Discord server.',
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
              'You need the **Manage Server** permission to manage logging.',
          }),
        ],
      });
      return;
    }

    try {
      const session = await createLoggingSessionState({
        guildId: message.guildId,
        requestedById: message.author.id,
        requestedByTag: message.author.tag,
      });

      const payload = buildLoggingSessionPayload(session, message.guild);

      const sentMessage = await reply(message, payload);

      session.message = sentMessage;
      registerLoggingSession(sentMessage.id, session);

      if (!scheduleLoggingSessionExpiry(session, sentMessage.id)) {
        const expiredPayload = buildLoggingSessionPayload(
          session,
          message.guild,
          { expired: true },
        );
        await sentMessage.edit(expiredPayload);
      }
    } catch (error) {
      console.error('Failed to open logging session:', error);
      await reply(message, {
        embeds: [
          buildErrorEmbed({
            description:
              error?.message ??
              'Unable to open the logging control panel right now.',
          }),
        ],
      });
    }
  },
};
