const { Message } = require('discord.js')
const archieembed = require("../../util/archieembed")


module.exports = {

    //Information about command
    name: "unmute",
    description: "unmutes the mentioned user",
    usage: "<@user>",
    enabled: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: ['MANAGE_ROLES'],
    botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {
        const member = message.mentions.members.first()
        if (!member) return archieembed('Member not found', message.channel)
        if (!member)
        return archieembed('Please mention a user or provide a valid user ID', message.channel);
        if (member.roles.highest.position >= message.member.roles.highest.position)
        return archieembed('You cannot unmute someone with an equal or higher role', message.channel);
        const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');

        await member.roles.remove(role)

        archieembed(`${member.displayName} is now unmuted`, message.channel)
    }
}