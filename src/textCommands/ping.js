import { buildInfoEmbed } from '../utils/embed.js';

const latencyBands = [
  {
    threshold: 100,
    color: 0x2ecc71,
    status: 'Excellent (<100ms)',
  },
  {
    threshold: 200,
    color: 0x27ae60,
    status: 'Good (<200ms)',
  },
  {
    threshold: 300,
    color: 0xf1c40f,
    status: 'Moderate (<300ms)',
  },
  {
    threshold: 400,
    color: 0xe67e22,
    status: 'Slow (<400ms)',
  },
  {
    threshold: 500,
    color: 0xe74c3c,
    status: 'Laggy (<500ms)',
  },
];

const fallbackLatencyBand = {
  color: 0x8b0000,
  status: 'Critical (>=500ms)',
};

const determineLatencyBand = (latency) => {
  for (const band of latencyBands) {
    if (latency < band.threshold) {
      return band;
    }
  }
  return fallbackLatencyBand;
};

const formatLatency = (value) =>
  `${value}ms (${(value / 1000).toFixed(2)}s)`;

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
    const latencyBand = determineLatencyBand(latency);

    const resultEmbed = buildInfoEmbed({
      title: 'Pong!',
      color: latencyBand.color,
      fields: [
        { name: 'Round Trip', value: formatLatency(latency), inline: true },
        { name: 'Gateway Heartbeat', value: `${heartbeat}ms`, inline: true },
        { name: 'Status', value: latencyBand.status, inline: true },
      ],
    });

    await sent.edit({ embeds: [resultEmbed] });
  },
};
