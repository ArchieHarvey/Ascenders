import { REST, Routes } from "discord.js";
import { commands } from "../src/commands/index.js";
import { config } from "../src/config/index.js";

const rest = new REST({ version: "10" }).setToken(config.token);

const payload = commands.map((command) => command.data.toJSON());

const route = config.guildId
  ? Routes.applicationGuildCommands(config.clientId, config.guildId)
  : Routes.applicationCommands(config.clientId);

try {
  console.log("Refreshing application commands...");
  await rest.put(route, { body: payload });
  console.log("Commands refreshed.");
} catch (error) {
  console.error("Failed to deploy commands.", error);
  process.exit(1);
}
