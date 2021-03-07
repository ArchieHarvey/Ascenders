const moment = require('moment')
const client = require('../ascenders')
const afkSchema = require('../models/afkSchema')
const { MessageEmbed } = require('discord.js')

client.on('message', async message => {
    if (message.author.bot) return;
    if (message.mentions.members.first()) {
        //If message mentions someone
        let results = await afkSchema.find({ guildId: message.guild.id }) //Find results

        if (results) { //If results exist sort through each one
            for (let i = 0; i < results.length; i++) {
                let { userId, afk, timestamp } = results[i]
                if (message.mentions.members.first().id === message.author.id) return; //If the author is the one pinged themselve return

                if (message.mentions.members.first().id === userId) {
                    let user = message.guild.members.cache.get(userId) //Send AFK message

                    return message.channel.send(new MessageEmbed()
                        .setColor(message.guild.me.displayColor)
                        .setAuthor(`${user.user.username} Is AFK`, user.user.displayAvatarURL())
                        .setDescription(`\`${afk}\``)
                        .setFooter(`Went AFK ${moment(timestamp).fromNow()}`))
                }
            }
        }
    }
    let afkResults = await afkSchema.find({ guildId: message.guild.id }) // Fetch results again
    if (afkResults) {
        for (let i = 0; i < afkResults.length; i++) { //Loop through results
            let { userId, timestamp, username } = afkResults[i]

            if (timestamp + (1000 * 10) <= new Date().getTime()) { //If author sends a message from less than 10 seconds before they used the command, it ignores

                if (message.author.id === userId) {
                    await afkSchema.findOneAndDelete({
                        guildId: message.guild.id,
                        userId: message.author.id
                    }) //Delete from document


                    message.member.setNickname(`${username}`).catch((e) => {
                        console.log('No Permissions')
                    }) //Set nickname back to old nickname

                    return message.channel.send(new MessageEmbed()
                        .setColor(message.guild.me.displayColor)
                        .setDescription(`**Welcome back, I removed your afk**`))
                }
                //}
            }
        }

    }
})