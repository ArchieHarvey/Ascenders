const archieembed = require("../../util/archieembed")
const config = require('../../config.json')
const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name: "translate",
    description: "Shows your text as Clyde\'s message",
    usage: "clyde <text>",
    enabled: true,
    aliases: [],
    category: "Fun",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        let google = args.slice(0).join('+');

        let link = `https://translate.google.com/?hl=tr#tr/en/` + google;
        if (!link) return message.reply("Hata !")
        if (!google) return message.reply("**Lütfen Ne Çevireceğimi Yaz**")
        let embed = new MessageEmbed()

            .setColor("0xe2ff00")
            .setTimestamp()

            .addField("Kelime:", `${args.slice(0).join(' ')}`)
            .addField('Link:', `${link}`)
            .setFooter('KOMA | VIP | Google Çeviri Sistemi')

        message.channel.send(embed);
    }
}
