const superagent = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch')

module.exports = {
    name: "wink",
    description: "Get a life.",
    usage: "wink",
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


        
        fetch('https://some-random-api.ml/animu/wink')
            .then(res => res.json())
            .then(json => {
                const wink = new MessageEmbed()
                    .setColor(`#FF0000`)
                    .setImage("attachment://wink.gif").attachFiles([{ attachment: json.link, name: "wink.gif" }])


                message.channel.send(wink)
            });
    }
};