const { Client, MessageEmbed } = require("discord.js")
const client = require('../ascenders.js')

/**
 * Easy to send errors because im lazy to do the same things :p
 * @param {String} text - Message which is need to send
 * @param {TextChannel} channel - A Channel to send error
 */
module.exports = async (text, channel) => {


    
    let embed = new MessageEmbed()
    .setColor("RED")
    .setDescription(text)
    .setFooter("Something went wrong :(")
    .setTimestamp()
    .setFooter("© Ascenders 2020 | Music Module")
    await channel.send(embed)
}
