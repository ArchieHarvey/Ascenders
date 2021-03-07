const superagent = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch')

module.exports = {
    name: "pat",
    description: "Get a life.",
    usage: "pat",
    enabled: true,
    aliases: [],
    category: "",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {


        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!member) return message.channel.send(`mention someone noob`)
        
        fetch('https://some-random-api.ml/animu/pat')
            .then(res => res.json())
            .then(json => {
                const pat = new MessageEmbed()
                    .setColor(`#FF0000`)
                    .setImage("attachment://pat.gif").attachFiles([{ attachment: json.link, name: "pat.gif" }])


                message.channel.send(pat)
            });
    }
};