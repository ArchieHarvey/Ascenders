const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('../../reconDB');
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "levelingcheck",
    description: "Checks if leveling is set or not",
    usage: "levellingcheck",
    enabled: true,
    aliases: [],
    category: "Utility",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        const check = await db.has(`leveling-${message.guild.id}`);
        if (check === false) return archieembed(`**Leveling is disabled!**\n\nTo enable it use \`${data.guild.prefix}leveling enable\``, message.channel);
        if (check === true)return archieembed(`**Leveling is enabled!**\n\nTo disable it use \`${data.guild.prefix}leveling disable\``, message.channel);
    }
}