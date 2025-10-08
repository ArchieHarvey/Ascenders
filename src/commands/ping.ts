import type { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommandBuilder as Builder } from 'discord.js';

export const data: SlashCommandBuilder = new Builder()
  .setName('ping')
  .setDescription('Check if the bot is online.');

export async function execute(interaction: ChatInputCommandInteraction) {
  const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
  const latency = sent.createdTimestamp - interaction.createdTimestamp;
  const websocketPing = interaction.client.ws.ping;
  await interaction.editReply(`Pong! Latency: ${latency}ms. WebSocket: ${websocketPing}ms.`);
}
