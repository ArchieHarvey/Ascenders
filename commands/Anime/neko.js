const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "neko",
    description: "Get a random Neko.",
    usage: "neko",
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
        const { url } = await fetch("https://nekos.life/api/v2/img/neko")
            .then((res) => res.json());

        const embed = new MessageEmbed()
            .setTitle("Neko")
            .setImage(url)
            .setTimestamp()
            .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 32 }));

        return message.channel.send({ embed });
    }
}