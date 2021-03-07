const { MessageEmbed } = require('discord.js')
var access = require("request");

module.exports = {
    name: "asciify",
    description: "Converts text to ascii characters",
    usage: "asciify [text]",
    enabled: false,
    aliases: [],
    category: "Utility",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {

        // Variables
        let words = args.join(" ");
        const msg = message

        // Input Checking
        const noInputErr = new MessageEmbed()
            .setDescription(`Invalid command usage, try using it like: \n \`${data.guild.prefix}asciify [text]\` \n\n Arguments: \n \`text\`: *Text (may include spaces)*`)
            .setColor('RED')
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!words) return message.channel.send(noInputErr);

        const textLength = new MessageEmbed()
            .setDescription('Error! The input argument cannot be over the 15 character limit!')
            .setColor('RED')
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (words.length > 15) return message.channel.send(textLength)

        // Executing
        access("https://artii.herokuapp.com/make?text=" + words, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                message.channel.send("\n```" + body + "```");
            }
            else {
                const error = new MessageEmbed()
                    .setDescription('An Unexpected Error Happened')
                    .setColor('RED')
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                message.channel.send(error);
            }
        });
    }
}