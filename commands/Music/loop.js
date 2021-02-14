const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {
  name: "loop",
description: "Toggle music loop",
usage: "",
enabled: true,
aliases: ["l"],
category: "Music",
memberPermissions: [],
botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
//Settings for command
nsfw: false,
ownerOnly: false,
cooldown: 0,

  async execute(client, message, args, data){ 
    const serverQueue = message.client.queue.get(message.guild.id);
       if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            return message.channel.send({
                embed: {
                    color: "GREEN",
                    description: `🔁  **|**  Loop is **\`${serverQueue.loop === true ? "enabled" : "disabled"}\`**`
                }
            });
        };
    return sendError("There is nothing playing in this server.", message.channel);
  },
};
