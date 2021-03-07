const { MessageEmbed } = require('discord.js');
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "debug",
    description: "debugs",
    usage: "",
    enabled: true,
    aliases: [],
    category: "Owner",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: true,
    cooldown: 0,
  
    async execute(client, message, args, data) {
        message.channel.send(`${client.user.username} connected in **${client.voice.connections.size}** channels !`)
    }
}