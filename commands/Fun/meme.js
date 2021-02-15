const { MessageEmbed } = require("discord.js");
const randomPuppy = require("random-puppy");

module.exports = {

    //Information about command
    name: "meme",
    description: "Gives you a meme",
    usage: "meme",
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
        const subReddits = ["dankmeme", "meme", "me_irl"];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];

        const image = await randomPuppy(random);
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setImage(image)
            .setTimestamp()
            .setFooter(`Requested by ${message.author.username} \n©Ascenders 2021`, client.user.displayAvatarURL())

        message.channel.send(embed);
    }
}