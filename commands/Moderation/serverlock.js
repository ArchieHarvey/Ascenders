const { MessageEmbed } = require('discord.js');

module.exports = {

    //Information about command
    name: "serverlock",
    description: "Locks the whole server",
    usage: "serverlock",
    enabled: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: [ "MANAGE_MESSAGES" ],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,
  
    //Execute to command once the settings have been checked
    async execute(client, message, args, data){
        const channels = message.guild.channels.cache.filter(ch => ch.type !== 'category');

        if (!args[0]) return message.channel.send("Invalid Command usage. Please say if you want to turn it on or off")

        if (args[0] === 'on') {
            channels.forEach(channel => {
                channel.updateOverwrite(message.guild.roles.everyone, {
                    SEND_MESSAGES: false
                }).then(() => {
                    channel.setName(channel.name += `🔒`)
                })
            })
            return message.channel.send('All channels have been locked');
        } else if (args[0] === 'off') {
            channels.forEach(channel => {
                channel.updateOverwrite(message.guild.roles.everyone, {
                    SEND_MESSAGES: true
                }).then(() => {
                        channel.setName(channel.name.replace('🔒', ''))
                    }
                )
            })
            return message.channel.send('All channels have been unlocked')
        }
    }
}