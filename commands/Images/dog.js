const Discord = require("discord.js");
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js')
module.exports = {
    //Command Information
    name: "dog",
    description: "Get a random image of a dog",
    usage: "dog",
    enabled: true,
    aliases: [],
    category: "Images",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {
        try {
            const res = await fetch('https://dog.ceo/api/breeds/image/random');
            const img = (await res.json()).message;
            const embed = new MessageEmbed()
                .setTitle('🐶  Woof!  🐶')
                .setImage(img)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor(message.guild.me.displayHexColor);
            message.channel.send(embed);
        } catch (err) {
            message.client.logger.error(err.stack);
            message.channel.send('Please try again in a few seconds');
        }


    },
};
