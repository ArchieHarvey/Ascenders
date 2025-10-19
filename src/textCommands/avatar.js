import { buildErrorEmbed, buildInfoEmbed } from '../utils/embed.js';

const mentionRegex = /^<@!?(\d+)>$/;

const buildAvatarEmbed = (user) => {
  const fullSizeUrl = user.displayAvatarURL({ size: 1024, forceStatic: false });
  const pngUrl = user.displayAvatarURL({ size: 1024, extension: 'png' });
  const webpUrl = user.displayAvatarURL({ size: 1024, extension: 'webp' });

  const embed = buildInfoEmbed({});

  embed
    .setImage(fullSizeUrl)
    .setAuthor({
      name: `${user.tag ?? user.username}'s avatar`,
      iconURL: user.displayAvatarURL({ size: 128, forceStatic: false }),
    })
    .addFields({
      name: 'Download',
      value: `[Original](${fullSizeUrl}) • [PNG](${pngUrl}) • [WEBP](${webpUrl})`,
    });

  return embed;
};

const resolveTargetUser = async (message, args) => {
  const [firstArg] = args;

  if (!firstArg) {
    return message.author;
  }

  const mentionMatch = mentionRegex.exec(firstArg);

  let userId = null;

  if (mentionMatch) {
    userId = mentionMatch[1];
  } else if (/^\d{15,20}$/.test(firstArg)) {
    userId = firstArg;
  }

  if (!userId) {
    throw new Error('Please provide a valid mention or user ID.');
  }

  return message.client.users.fetch(userId);
};

export default {
  name: 'avatar',
  description: 'Show the avatar for a user.',
  aliases: ['pfp'],
  usage: '[@user|userID]',
  async execute(message, args) {
    try {
      const target = await resolveTargetUser(message, args);
      const embed = buildAvatarEmbed(target);

      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false, parse: [] },
      });
    } catch (error) {
      console.error('Failed to show avatar (text command):', error);
      const errorEmbed = buildErrorEmbed({
        description:
          error.message === 'Please provide a valid mention or user ID.'
            ? error.message
            : 'Unable to fetch that avatar right now. Please try again later.',
      });

      await message.reply({
        embeds: [errorEmbed],
        allowedMentions: { repliedUser: false, parse: [] },
      });
    }
  },
};
