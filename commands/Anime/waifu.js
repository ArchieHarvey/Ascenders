const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "waifu",
    description: "Get a random waifu.",
    usage: "waifu",
    enabled: true,
    aliases: [],
    category: "Anime",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        const embed = new MessageEmbed()
            .setTitle("Waifu")
            .setImage(`https://www.thiswaifudoesnotexist.net/example-${Math.floor(Math.random() * 100000)}.jpg`)
            .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 32 }))
            .setTimestamp()
        return message.channel.send(embed);
    }
}