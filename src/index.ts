import { Client, Collection, Events, GatewayIntentBits, Interaction, REST, Routes } from 'discord.js';
import { config } from './config.js';
import * as pingCommand from './commands/ping.js';
import type { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { UpdateService } from './services/updateService.js';

type CommandModule = {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

const commands = new Collection<string, CommandModule>();
commands.set(pingCommand.data.name, pingCommand);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(config.discordToken);
const updateService = new UpdateService(client);

async function registerCommands() {
  const body = commands.map((command) => command.data.toJSON());

  if (config.guildId) {
    await rest.put(Routes.applicationGuildCommands(config.applicationId, config.guildId), { body });
    console.log(`Registered ${body.length} guild command(s).`);
  } else {
    await rest.put(Routes.applicationCommands(config.applicationId), { body });
    console.log(`Registered ${body.length} global command(s).`);
  }
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
  await registerCommands();
  await updateService.init();
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = commands.get(interaction.commandName);
      if (!command) {
        await interaction.reply({ content: 'Command not found.', ephemeral: true });
        return;
      }
      await command.execute(interaction);
    } else if (interaction.isButton()) {
      await updateService.handleInteraction(interaction);
    }
  } catch (error) {
    console.error('Error handling interaction', error);
    if (interaction.isRepliable()) {
      const content = 'There was an error while executing this interaction.';
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content });
      } else {
        await interaction.reply({ content, ephemeral: true });
      }
    }
  }
});

client.login(config.discordToken).catch((error) => {
  console.error('Failed to login to Discord', error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await updateService.destroy();
  client.destroy();
  process.exit(0);
});
