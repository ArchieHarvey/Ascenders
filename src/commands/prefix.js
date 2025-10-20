import {
  PermissionsBitField,
  SlashCommandBuilder,
} from 'discord.js';
import {
  clearGuildPrefix,
  getDefaultPrefix,
  getGuildPrefix,
  getGuildSettings,
  setGuildPrefix,
} from '../services/guildSettingsService.js';
import {
  buildErrorEmbed,
  buildSuccessEmbed,
} from '../utils/embed.js';
import {
  buildSessionPayloadFromSession,
  createPrefixSessionState,
  endPrefixSession,
  formatPrefix,
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
    .setDefaultMemberPermissions(requiresManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('view')
        .setDescription('View the current prefix and manage it with buttons.'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Update the prefix immediately.')
        .addStringOption((option) =>
          option
            .setName('value')
            .setDescription('The new prefix to use.')
            .setMaxLength(15)
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('reset')
        .setDescription('Reset the prefix back to the default value.'),
    ),
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

    const subcommand = interaction.options.getSubcommand();
    const defaultPrefix =
      interaction.client?.defaultPrefix ?? getDefaultPrefix();

    switch (subcommand) {
      case 'view': {
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
        session.channel =
          sentMessage.channel ?? interaction.channel ?? null;
        registerPrefixSession(sentMessage.id, session);

        if (!scheduleSessionExpiry(session, sentMessage.id)) {
          const expiryPayload = buildSessionPayloadFromSession(
            session,
            'expired',
            {
              expired: true,
            },
          );

          await sentMessage.edit(expiryPayload).catch((error) => {
            console.error('Failed to finalize prefix controls:', error);
          });

          endPrefixSession(sentMessage.id);
        }
        return;
      }

      case 'set': {
        const newPrefix = interaction.options
          .getString('value', true)
          .trim();

        if (!newPrefix) {
          await interaction.reply({
            embeds: [
              buildErrorEmbed({
                description:
                  'Provide the new prefix you would like to use. Example: `/prefix set value:$`',
              }),
            ],
            ephemeral: true,
          });
          return;
        }

        try {
          const result = await setGuildPrefix({
            guildId: interaction.guildId,
            prefix: newPrefix,
            userId: interaction.user.id,
            userTag: interaction.user.tag,
          });

          const effectivePrefix = result?.prefix ?? newPrefix;

          const embed = buildSuccessEmbed({
            title: 'Prefix Updated',
            description: `Commands in this server will now use ${formatPrefix(
              effectivePrefix,
            )} as the prefix.`,
            fields: [
              {
                name: 'Current Prefix',
                value: formatPrefix(effectivePrefix),
                inline: true,
              },
            ],
          });

          await interaction.reply({
            embeds: [embed],
            allowedMentions: { parse: [] },
          });
        } catch (error) {
          console.error('Failed to set guild prefix via slash command:', error);
          await interaction.reply({
            embeds: [
              buildErrorEmbed({
                description:
                  error?.message ??
                  'Unable to update the prefix right now. Please try again later.',
              }),
            ],
            ephemeral: true,
          });
        }

        return;
      }

      case 'reset': {
        try {
          await clearGuildPrefix({
            guildId: interaction.guildId,
            userId: interaction.user.id,
            userTag: interaction.user.tag,
          });

          const embed = buildSuccessEmbed({
            title: 'Prefix Reset',
            description:
              'The custom prefix has been cleared. This server now uses the default prefix.',
            fields: [
              {
                name: 'Current Prefix',
                value: formatPrefix(defaultPrefix),
                inline: true,
              },
            ],
          });

          await interaction.reply({
            embeds: [embed],
            allowedMentions: { parse: [] },
          });
        } catch (error) {
          console.error('Failed to reset guild prefix via slash command:', error);
          await interaction.reply({
            embeds: [
              buildErrorEmbed({
                description:
                  error?.message ??
                  'Unable to reset the prefix right now. Please try again later.',
              }),
            ],
            ephemeral: true,
          });
        }

        return;
      }

      default: {
        await interaction.reply({
          embeds: [
            buildErrorEmbed({
              description: 'Unknown action for `/prefix`.',
            }),
          ],
          ephemeral: true,
        });
      }
    }
  },
};
