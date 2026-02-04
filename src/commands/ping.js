import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(" ");
};

export const pingCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Show the bot health and latency."),
  async execute(interaction) {
    const gatewayPing = Math.round(interaction.client.ws.ping);
    const roundTrip = Date.now() - interaction.createdTimestamp;
    const uptime = interaction.client.uptime
      ? formatDuration(interaction.client.uptime)
      : "Unavailable";

    const embed = new EmbedBuilder()
      .setTitle("Bot Status")
      .setDescription("Latency and runtime details for the current session.")
      .setColor(0x2b90d9)
      .addFields(
        {
          name: "Round-trip latency",
          value: `${roundTrip}ms`,
          inline: true,
        },
        {
          name: "Gateway ping",
          value: `${gatewayPing}ms`,
          inline: true,
        },
        {
          name: "Uptime",
          value: uptime,
          inline: true,
        }
      )
      .setFooter({ text: "Ascenders • Health Check" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
