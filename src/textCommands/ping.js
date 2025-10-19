import { buildInfoEmbed } from '../utils/embed.js';

export default {
  name: 'ping',
  description: 'Check the bot latency.',
  aliases: ['latency'],
  async execute(message) {
    const pendingEmbed = buildInfoEmbed({
      title: 'Ping',
      description: 'Measuring latency...',
    });

    const sent = await message.reply({
      embeds: [pendingEmbed],
      allowedMentions: { repliedUser: false },
    });

    const latency = sent.createdTimestamp - message.createdTimestamp;
    const heartbeat = Math.round(message.client.ws.ping);

    const resultEmbed = buildInfoEmbed({
      title: 'Pong!',
      fields: [
        { name: 'Round Trip', value: `${latency}ms`, inline: true },
        { name: 'Heartbeat', value: `${heartbeat}ms`, inline: true },
      ],
    });

    await sent.edit({ embeds: [resultEmbed] });
  },
};
