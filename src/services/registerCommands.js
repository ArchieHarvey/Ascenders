import { REST, Routes } from "discord.js";
import { config } from "../config/index.js";
import { logger } from "./logger.js";

export const registerCommands = async (commands) => {
  const rest = new REST({ version: "10" }).setToken(config.token);
  const body = commands ?? [];
  const route = config.guildId
    ? Routes.applicationGuildCommands(config.clientId, config.guildId)
    : Routes.applicationCommands(config.clientId);

  try {
    await rest.put(route, { body });
    logger.info(`Registered ${body.length} command${body.length === 1 ? "" : "s"}.`, {
      scope: config.guildId ? "guild" : "global",
    });
  } catch (error) {
    logger.error("Failed to register commands.", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};
