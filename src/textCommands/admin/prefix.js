import { PermissionsBitField } from 'discord.js';
import {
  clearGuildPrefix,
  getDefaultPrefix,
  getGuildPrefix,
  getGuildSettings,
  setGuildPrefix,
} from '../../services/guildSettingsService.js';
import {
  buildErrorEmbed,
  buildInfoEmbed,
  buildSuccessEmbed,
} from '../../utils/embed.js';

const requiresManageGuild = PermissionsBitField.Flags.ManageGuild;

const reply = (message, payload) =>
  message.reply({
    ...payload,
    allowedMentions: { repliedUser: false, parse: [] },
  });

const formatPrefix = (value) => `\`${value}\``;

export default {
  name: 'prefix',
  description: 'View or update the bot prefix for this server.',
  aliases: [],
  usage: '[view|set <prefix>|reset]',
  async execute(message, args) {
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

    const action = (args[0]?.toLowerCase() ?? 'view');
    const defaultPrefix = message.client?.defaultPrefix ?? getDefaultPrefix();

    switch (action) {
      case 'view': {
        const [settings, currentPrefix] = await Promise.all([
          getGuildSettings(message.guildId),
          getGuildPrefix(message.guildId),
        ]);

        const usingDefault = currentPrefix === defaultPrefix;
        const fields = [
          {
            name: 'Current Prefix',
            value: formatPrefix(currentPrefix),
            inline: true,
          },
          {
            name: 'Default Prefix',
            value: formatPrefix(defaultPrefix),
            inline: true,
          },
        ];

        if (settings?.updatedAt) {
          fields.push({
            name: 'Last Updated',
            value: `<t:${Math.floor(new Date(settings.updatedAt).getTime() / 1000)}:R>`,
            inline: true,
          });
        }

        if (settings?.updatedByTag) {
          fields.push({
            name: 'Last Updated By',
            value: settings.updatedByTag,
            inline: true,
          });
        }

        const embed = buildInfoEmbed({
          title: 'Server Prefix',
          description: usingDefault
            ? 'This server is using the default prefix.'
            : 'This server has a custom prefix configured.',
          fields,
        });

        await reply(message, { embeds: [embed] });
        return;
      }

      case 'set': {
        const newPrefix = args[1]?.trim();

        if (!newPrefix) {
          await reply(message, {
            embeds: [
              buildErrorEmbed({
                description:
                  'Provide the new prefix you would like to use. Example: `prefix set $`',
              }),
            ],
          });
          return;
        }

        try {
          const result = await setGuildPrefix({
            guildId: message.guildId,
            prefix: newPrefix,
            userId: message.author.id,
            userTag: message.author.tag,
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
              {
                name: 'Default Prefix',
                value: formatPrefix(defaultPrefix),
                inline: true,
              },
            ],
          });

          await reply(message, { embeds: [embed] });
        } catch (error) {
          console.error('Failed to set guild prefix:', error);
          await reply(message, {
            embeds: [
              buildErrorEmbed({
                description:
                  error?.message ??
                  'Unable to update the prefix right now. Please try again later.',
              }),
            ],
          });
        }

        return;
      }

      case 'reset': {
        try {
          await clearGuildPrefix({
            guildId: message.guildId,
            userId: message.author.id,
            userTag: message.author.tag,
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

          await reply(message, { embeds: [embed] });
        } catch (error) {
          console.error('Failed to reset guild prefix:', error);
          await reply(message, {
            embeds: [
              buildErrorEmbed({
                description:
                  error?.message ??
                  'Unable to reset the prefix right now. Please try again later.',
              }),
            ],
          });
        }

        return;
      }

      default: {
        await reply(message, {
          embeds: [
            buildErrorEmbed({
              description:
                'Unknown action. Use `view`, `set <prefix>`, or `reset`.',
            }),
          ],
        });
      }
    }
  },
};
