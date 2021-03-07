const canvacord = require('canvacord')
const Discord = require('discord.js')
const archieembed = require('../../util/archieembed')

module.exports = {
    name: "yt-comment",
    description: "comment youtube",
    usage: "yt-comment [text]",
    enabled: true,
    aliases: [],
    category: "Fun",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {

        const invalid = new MessageEmbed()
            .setColor('RED')
            .setDescription(`Invalid command usage, try using it like: \n \`${data.guild.prefix}comment [message]\` \n\n Arguments: \n \`message\`: *Text (may include spaces)*`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!args[0]) return message.channel.send(invalid)

        let options = {
            username: message.author.username,
            content: args.join(' '),
            avatar: message.author.displayAvatarURL({ dynamic: false, format: 'png' }),
            dark: true
        }
        try {
            let image = await canvacord.Canvas.youtube(options); /*make sure to have await here */

            let attachment = new Discord.MessageAttachment(image, "comment.png");

            return message.channel.send(attachment);
        } catch (err) {
            message.client.logger.error(err.stack);
            message.channel.send('Please try again in a few seconds');
        }
    }
}