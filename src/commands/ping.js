import { SlashCommandBuilder } from 'discord.js';
import { buildInfoEmbed } from '../utils/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot latency.'),
  async execute(interaction) {
    const pendingEmbed = buildInfoEmbed({
      title: 'Ping',
      description: 'Measuring latency...',
    });

    const sent = await interaction.reply({
      embeds: [pendingEmbed],
      fetchReply: true,
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const heartbeat = Math.round(interaction.client.ws.ping);

    const resultEmbed = buildInfoEmbed({
      title: 'Pong!',
      fields: [
        { name: 'Round Trip', value: `${latency}ms`, inline: true },
        { name: 'Heartbeat', value: `${heartbeat}ms`, inline: true },
      ],
    });

    await interaction.editReply({ embeds: [resultEmbed] });
  },
};
