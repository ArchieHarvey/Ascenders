const Discord = require("discord.js");
const superagent = require('superagent');


module.exports = {
    name: "pussy",
    description: "Get a life.",
    usage: "",
    enabled: true,
    aliases: [],
    category: "NSFW",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: true,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {



        //if (!message.channel.nsfw) return message.channel.send('You must use this command in an nsfw lounge!') 

        var lo = new Discord.MessageEmbed()
            .setDescription(`Please wait <a:AnimatedLoading:709735586608447488>`)
            .setTimestamp()

        message.channel.send(lo).then(m => {

            superagent.get('https://nekobot.xyz/api/image').query({ type: 'pussy' }).end((err, response) => {

                var embed_nsfw = new Discord.MessageEmbed()
                    .setDescription(`:underage:\n**[image not loading? click here](${response.body.message})**`)
                    .setTimestamp()
                    .setImage(response.body.message)

                m.edit(embed_nsfw);
            });
        });
    }
}