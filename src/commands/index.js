import { pingCommand } from "./ping.js";
import { updateCommand } from "./update.js";

export const commands = [pingCommand, updateCommand];

export const commandMap = new Map(commands.map((command) => [command.data.name, command]));
