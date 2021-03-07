const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('../../reconDB');
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "antispamcheck",
    description: "Checks if autorole is set or not",
    usage: "autorole",
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
        const check = await db.has(`antispam-${message.guild.id}`);
        if (check === false) return archieembed(`**Antispam is disabled!**\n\nTo enable it use \`${data.guild.prefix}antispam enable\``, message.channel);
        if (check === true)return archieembed(`**Antispam is enabled!**\n\nTo disable it use \`${data.guild.prefix}antispam disable\``, message.channel);
    }
}