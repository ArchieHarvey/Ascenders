const { MessageEmbed } = require('discord.js');
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
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {

        // Get message
        if (!args[0]) return archieembed('Please provide a message to tweet', message.channel)
        let tweet = message.content.slice(message.content.indexOf(args[0]), message.content.length);
        if (tweet.length > 68) tweet = tweet.slice(0, 65) + '...';

        try {
            const res = await fetch('https://nekobot.xyz/api/imagegen?type=trumptweet&text=' + tweet);
            const img = (await res.json()).message;
            const embed = new MessageEmbed()
                .setImage(img)
            message.channel.send(embed);
        } catch (err) {
            message.client.logger.error(err.stack);
            message.channel.send('Please try again in a few seconds');
        }
    }
};