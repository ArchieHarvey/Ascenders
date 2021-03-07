const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('../../reconDB');
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "leveling",
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
            if (await db.has(`leveling-${message.guild.id}`) === false) {

                await db.set(`leveling-${message.guild.id}`, true)
                archieembed('Leveling activated', message.channel)

            } else return archieembed('Leveling Module is aldready activated', message.channel)

        else if (args[0] === 'disable')
            if (await db.has(`leveling-${message.guild.id}`) === true) {

                await db.delete(`leveling-${message.guild.id}`);
                archieembed('Leveling deactivated', message.channel)

            } else return archieembed('Leveling Module is already deactivated', message.channel)

    }
}