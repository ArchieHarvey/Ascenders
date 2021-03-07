const superagent = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch')

module.exports = {
    name: "facepalm",
    description: "Get a life.",
    usage: "facepalm",
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


        
        fetch('https://some-random-api.ml/animu/face-palm')
            .then(res => res.json())
            .then(json => {
                const facepalm = new MessageEmbed()
                    .setColor(`#FF0000`)
                    .setImage("attachment://face-palm.gif").attachFiles([{ attachment: json.link, name: "face-palm.gif" }])


                message.channel.send(facepalm)
            });
    }
};