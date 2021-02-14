const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    //Command Information
    name: "fox",
    description: "Get a random image of a fox",
    usage: "fox",
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
            const res = await fetch('https://randomfox.ca/floof/');
            const img = (await res.json()).image;
            const embed = new MessageEmbed()
                .setTitle('What does the fox say? 🦊')
                .setImage(img)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor(message.guild.me.displayHexColor);
            message.channel.send(embed);
        } catch (err) {
            message.client.logger.error(err.stack);
            this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
        }
    }
};