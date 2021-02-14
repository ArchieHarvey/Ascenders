const { Client, MessageEmbed } = require("discord.js")
const client = require('discord.js')
/**
 * Easy to send errors because im lazy to do the same things :p
 * @param {String} text - Message which is need to send
 * @param {TextChannel} channel - A Channel to send error
 */
module.exports = async (text, channel) => {

    
    let embed = new MessageEmbed()
    .setColor("RANDOM")
    .setDescription(text)
    .setTimestamp()
    .setFooter("©Ascenders 2021 | v2.2.10")
    await channel.send(embed)
}

/*const archieembed = require("../../util/archieembed");

return archieembed(, message.channel)*/