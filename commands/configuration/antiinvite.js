const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('../../reconDB');
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "antiinvite",
    description: "Tells which role autorole is set to",
    usage: "",
    enabled: true,
    aliases: [],
    category: "Utility",
    memberPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        if (args[0] === 'enable')
            if (await db.has(`antiinvite-${message.guild.id}`) === false) {

                await db.set(`antiinvite-${message.guild.id}`, true)
                archieembed('antiinvite activated', message.channel)

            } else return archieembed('antiinvite is aldready activated', message.channel)

        else if (args[0] === 'disable')
            if (await db.has(`antiinvite-${message.guild.id}`) === true) {

                await db.delete(`antiinvite-${message.guild.id}`);
                archieembed('antiinvite deactivated', message.channel)

            } else return archieembed('antiinvite is already deactivated', message.channel)

    }
}