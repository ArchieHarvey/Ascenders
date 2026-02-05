import { pingCommand } from "./ping.js";
import { updateCommand } from "./update.js";
import { avatarCommand } from "./avatar.js";

export const commands = [pingCommand, updateCommand, avatarCommand];

export const commandMap = new Map(commands.map((command) => [command.data.name, command]));
