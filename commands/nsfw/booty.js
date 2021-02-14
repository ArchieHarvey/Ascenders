const Discord = require("discord.js");
module.exports = {
    name: "booty",
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

        var superagent = require('superagent');

        //if (!message.channel.nsfw) return message.channel.send('Vous devez utiliser cette commande dans un salon nsfw !') 

        var lo = new Discord.MessageEmbed()
            .setDescription(`Please wait <a:AnimatedLoading:709735586608447488>`)
            .setTimestamp()

        message.channel.send(lo).then(m => {

            superagent.get('https://nekobot.xyz/api/image').query({ type: 'ass' }).end((err, response) => {

                var embed_nsfw = new Discord.MessageEmbed()
                    .setDescription(`:underage: **[Image not loading? Click here](${response.body.message})**`)
                    .setTimestamp()
                    .setImage(response.body.message)

                m.edit(embed_nsfw);
            });
        });
    }
}