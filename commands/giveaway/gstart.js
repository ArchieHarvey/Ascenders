const giveawayClient = require('../../client');
const { Client, Message, MessageEmbed } = require('discord.js');
const ms = require('ms');
const { channels } = require('../../ascenders');

module.exports = {
    name: "gstart",
    description: "starts a giveaway",
    usage: "gstart",
    enabled: true,
    aliases: [],
    category: "Anime",
    memberPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You dont have manage messages permission.')
        
        const error = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle(`Invalid Usage`)
            .setDescription(`Usage: ${data.guild.prefix}gstart #channel <time> <winners> <prize>`)
            .setTimestamp()

        const channel = message.mentions.channels.first()
        if(!channel) return message.channel.send(error)

        const duration = args[1]
        if(!duration) return message.channel.send(error)

        const winners = args[2]
        if(!winners) return message.channel.send(error)

        const prize = args.slice(3).join(" ")
        if(!prize) return message.channel.send(error)

        client.giveaways.start(channel, {
            time : ms(duration),
            prize : prize,
            winnerCount: winners,
            hostedBy: message.author,
            messages: {
                giveaway: "🎉🎉**GIVEAWAY**🎉🎉",
                giveawayEnd: "🎉🎉**GIVEAWAY ENDED**🎉🎉",
                timeRemaining: "Time Remaining **{duration}**",
                inviteToParticipate: "React with 🎉 to join the giveaway",
                winMessage: "Congrats {winners}, you have  won the giveaway",
                embedFooter: "Giveaway Time!",
                noWinner: "Could not determine a winner",
                hostedBy: 'Hosted by {user}',
                winners: "winners",
                endedAt: 'Ends at',
                units: {
                    seconds: "seconds",
                    minutes: "minutes",
                    hours: 'hours',
                    days: 'days',
                    pluralS: false
                }
            },
           
        })
        message.channel.send(`Giveaway is starting in ${channel}`)
    
    }
}