const { MessageEmbed } = require('discord.js')

module.exports = {

    //Information about command
    name: "qr",
    description: "Get the instagram of the requested user",
    usage: "qr <text>",
    enabled: true,
    aliases: ["ig", "insta"],
    category: "Fun",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {
        const qrcode = args.join("+");
        if (!qrcode) return message.channel.send("Please Give Your Message!");

        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setImage(encodeURI(`https://chart.googleapis.com/chart?chl=${qrcode}&chs=200x200&cht=qr&chld=H%7C0`))
            .setFooter("Supports Text and URL")
            .setTimestamp();

        return message.channel.send(embed);
    }
}