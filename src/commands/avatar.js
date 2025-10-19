import { SlashCommandBuilder } from 'discord.js';
import { buildInfoEmbed, buildErrorEmbed } from '../utils/embed.js';

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

export default {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Show the avatar for a user.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to view the avatar for.')
        .setRequired(false),
    ),
  async execute(interaction) {
    try {
      const target =
        interaction.options.getUser('user', false) ?? interaction.user;

      const embed = buildAvatarEmbed(target);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Failed to show avatar (slash command):', error);
      const errorEmbed = buildErrorEmbed({
        description: 'Unable to fetch that avatar right now. Please try again later.',
      });

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  },
};
