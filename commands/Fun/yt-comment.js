const canvacord = require('canvacord')
const Discord = require('discord.js')
const archieembed = require('../../util/archieembed')

module.exports = {
    name: "yt-comment",
    description: "comment youtube",
    usage: "yt-comment [text]",
    enabled: true,
    aliases: [""],
    category: "Fun",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        if (!args[0]) return archieembed("Input is missing! What do you want to comment", message.channel)
        let options = {
            username: message.author.username,
            content: args.join(' '),
            avatar: message.author.displayAvatarURL({ dynamic: false, format: 'png' }),
            dark: true
        }
        let image = await canvacord.Canvas.youtube(options); /*make sure to have await here */

        let attachment = new Discord.MessageAttachment(image, "comment.png");

        let newembed = new Discord.MessageEmbed()
            .attachFiles([attachment])
            .setImage("attachment://comment.png")
        message.channel.send(newembed)
    }
}