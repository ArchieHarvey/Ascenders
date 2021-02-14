const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {

    //Information about command
    name: "binary",
    description: "converts to binary",
    usage: "binary <>",
    enabled: true,
    aliases: [],
    category: "Fun",
    memberPermissions: [],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,
  
    //Execute to command once the settings have been checked
    async execute(client, message, args, data){ 
        const url = `http://some-random-api.ml/binary?text=${args}`;

        let response, bins;
        try {
            response = await axios.get(url);
            data = response.bins;
        } catch (e) {
            return message.channel.send({embed: {
                color: "RANDOM",
                description: `Invalid command usage, try using it like: \n \`${data.guild.prefix}binary [text]\` \n\n Arguments: \n \`text\`: *Text (may include spaces)*`,
                timestamp: new Date(),
                footer: {
                              icon_url: client.user.displayAvatarURL(),
                              text: "© Ascenders 2020 | v1.1.25"
            }}
            })
        }

        const embed = new MessageEmbed()
            .setTitle('Text to Binary')
            .setDescription(bins.text)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter("© Ascenders 2020 | v1.1.25", client.user.displayAvatarURL())

        await message.channel.send(embed)
    }
}