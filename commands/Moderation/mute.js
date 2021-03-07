const { Message, MessageEmbed } = require('discord.js')
const ms = require('ms')
const archieembed = require("../../util/archieembed");

module.exports = {

    //Information about command
    name: "mute",
    description: "Mutes the mentioned user",
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
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return archieembed(`You need manage message permissions to use this command`, message.channel)
        const member = message.mentions.members.first()
        if (member === message.member)
            return archieembed('You cannot mute yourself', message.channel);
        if (member === message.guild.me) return archieembed('You cannot mute me', message.channel);
        if (member.roles.highest.position >= message.member.roles.highest.position)
            return archieembed('You cannot mute someone with an equal or higher role', message.channel);
        if (!member) return archieembed(`Member is not found.`, message.channel)
        const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'muted')
        if (!role) {
            try {
                message.channel.send({
                    embed: {
                        color: "RANDOM",
                        author: {
                            name: client.user.username,
                            icon_url: client.user.displayAvatarURL()
                        },
                        description: 'Muted role is not found, attempting to create muted role.',
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.displayAvatarURL(),
                            text: `© Ascenders ${new Date().getFullYear()}`
                        }
                    }
                })

                let muterole = await message.guild.roles.create({
                    data: {
                        name: 'muted',
                        permissions: []
                    }
                });
                message.guild.channels.cache.filter(c => c.type === 'text').forEach(async (channel, id) => {
                    await channel.createOverwrite(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    })
                });
                message.channel.send({
                    embed: {
                        color: "RANDOM",
                        author: {
                            name: client.user.username,
                            icon_url: client.user.displayAvatarURL()
                        },
                        description: 'Muted role has sucessfully been created.',
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.displayAvatarURL(),
                            text: `© Ascenders ${new Date().getFullYear()}`
                        }
                    }
                })
            } catch (error) {
                console.log(error)
            }
        };
        let role2 = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted')
        if (member.roles.cache.has(role2.id)) return archieembed(`${member.displayName} has already been muted.`, message.channel)
        await member.roles.add(role2)
        return archieembed(`${member.displayName} is now muted.`, message.channel)
    }
}