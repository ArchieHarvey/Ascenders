import { Events } from 'discord.js';
import {
  getDefaultPrefix,
  getGuildPrefix,
} from '../services/guildSettingsService.js';
import { buildInfoEmbed } from '../utils/embed.js';

export default {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot || !message.guild) {
      return;
    }

    const fallbackPrefix = client.defaultPrefix ?? getDefaultPrefix();

    let prefix = fallbackPrefix;
    try {
      prefix = await getGuildPrefix(message.guildId);
    } catch (error) {
      console.error('Failed to resolve guild prefix, using fallback:', error);
    }

    const content = message.content.trim();

    const botMention =
      client.user &&
      new RegExp(`^<@!?${client.user.id}>`).exec(content);

    let usedPrefix = null;

    if (content.startsWith(prefix)) {
      usedPrefix = prefix;
    } else if (botMention) {
      usedPrefix = botMention[0];
    }

    if (!usedPrefix) {
      return;
    }

  const withoutPrefix = content
    .slice(usedPrefix.length)
    .trim();

  if (!withoutPrefix) {
    if (botMention) {
      const isDefaultPrefix = prefix === fallbackPrefix;
      const textPrefixValue = isDefaultPrefix
        ? `\`${prefix}\` (default)`
        : `\`${prefix}\``;

      const embed = buildInfoEmbed({
        title: `Hey, I'm ${client.user.username}!`,
        description: [
          'Use my text commands or slash commands to get things done.',
          `Try \`${prefix}help\` for classic commands or run \`/help\` to browse slash commands.`,
        ].join('\n'),
        fields: [
          {
            name: 'Text Command Prefix',
            value: textPrefixValue,
            inline: true,
          },
          {
            name: 'Slash Commands',
            value: '`/prefix`, `/status`, `/help`, and more.',
            inline: true,
          },
        ],
        footer: {
          text: 'Need a different prefix? Use /prefix or prefix to open the manager.',
        },
      });

      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false, parse: [] },
      });
    }
    return;
  }

    const args = withoutPrefix.split(/\s+/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) {
      return;
    }

    const command = client.textCommands.get(commandName);

    if (!command) {
      return;
    }

    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(`Error executing text command ${commandName}:`, error);
      await message.reply({
        content: 'Something went wrong while executing that command.',
        allowedMentions: { repliedUser: false },
      });
    }
  },
};
