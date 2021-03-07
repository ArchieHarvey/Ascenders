const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('../../reconDB');
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "anticurse",
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
            if (await db.has(`anticurse-${message.guild.id}`) === false) {

                await db.set(`anticurse-${message.guild.id}`, true)
                archieembed('anticurse activated', message.channel)

            } else return archieembed('Anticurse is aldready activated', message.channel)

        else if (args[0] === 'disable')
            if (await db.has(`anticurse-${message.guild.id}`) === true) {

                await db.delete(`anticurse-${message.guild.id}`);
                archieembed('Anticurse deactivated', message.channel)

            } else return archieembed('anticurse is already deactivated', message.channel)

    }
}