const superagent = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch')

module.exports = {
    name: "hug",
    description: "Get a life.",
    usage: "hug",
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

        fetch('https://some-random-api.ml/animu/hug')
            .then(res => res.json())
            .then(json => {
                const hug = new MessageEmbed()
                    .setDescription(`<@${message.author.id}> hugged <@${member.user.id}>`)
                    .setColor(`#FF0000`)
                    .setImage("attachment://file.gif").attachFiles([{ attachment: json.link, name: "file.gif" }])


                message.channel.send(hug)
            });

        /*
   const main = await fetch("https://neko-love.xyz/api/v1/hug", {
     headers: {
       "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
     }
   });
   const mat = await main.json();
 
   if (mat.code !== 200) {
     return console.log("Error 01: Unable to access the json content of API");
   }
 
   
     const hug = new MessageEmbed()
       .setColor(`#FFC0CB`)
       .setTitle(`<@${message.author.tag}> hugged + args`)
       .setImage("attachment://file.png").attachFiles([{ attachment: mat.url, name: "file.png" }])
 
 
     message.channel.send(hug);*/

    }
};