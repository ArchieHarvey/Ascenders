import { pingCommand } from "./ping.js";
import { updateCommand } from "./update.js";
import { avatarCommand } from "./avatar.js";
import { restartCommand } from "./restart.js";

export const commands = [pingCommand, updateCommand, avatarCommand, restartCommand];

export const commandMap = new Map(commands.map((command) => [command.data.name, command]));
