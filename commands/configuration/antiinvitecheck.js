const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('../../reconDB');
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "antiinvitecheck",
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
        const check = await db.has(`antiinvite-${message.guild.id}`);
        if (check === false) return archieembed(`**antiinvite is disabled!**\n\nTo enable it use \`${data.guild.prefix}antiinvite enable\``, message.channel);
        if (check === true)return archieembed(`**antiinvite is enabled!**\n\nTo disable it use \`${data.guild.prefix}antiinvite disable\``, message.channel);
    }
}