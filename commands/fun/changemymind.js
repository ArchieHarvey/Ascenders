const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "changemymind",
  description: "among us eject",
  usage: "eject <user>",
  enabled: true,
  aliases: ["c4", "cf"],
  category: "Games",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" , "ADD_REACTIONS"],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        const text = args.join(" ");

        if (!text) return message.channel.send("Please provide text");
    
        const sendMsg = await message.channel.send(":gear: Processing Image..");
    
        const bruh = await fetch(
          `https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`
        ).then((res) => res.json());
    
        sendMsg.delete();
        const embed = new MessageEmbed()
          .setFooter(message.author.username)
          .setColor("BLUE")
          .setImage(bruh.message)
          .setTimestamp();
    
        message.channel.send({ embed });
    }
}