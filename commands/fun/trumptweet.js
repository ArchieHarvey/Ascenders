const { MessageEmbed, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "trumptweet",
    description: "Display\'s a custom tweet from Donald Trump with the message provided.",
    usage: 'trumptweet <message>',
    enabled: true,
    aliases: ['trump'],
    category: "Fun",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {

        // Get message
        const invalid = new MessageEmbed()
            .setColor('RED')
            .setDescription(`Invalid command usage, try using it like: \n \`${data.guild.prefix}trumptweet [message]\` \n\n Arguments: \n \`message\`: *Text (may include spaces)*`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!args[0]) return message.channel.send(invalid)

        let tweet = message.content.slice(message.content.indexOf(args[0]), message.content.length);
        
        if (tweet.length > 68) tweet = tweet.slice(0, 65) + '...';

        try {
            const res = await fetch('https://nekobot.xyz/api/imagegen?type=trumptweet&text=' + tweet);
            const img = (await res.json()).message;
            const attachment = new MessageAttachment(img);
            return message.channel.send(attachment);
        } catch (err) {
            message.client.logger.error(err.stack);
            message.channel.send('Please try again in a few seconds');
        }
    }
};