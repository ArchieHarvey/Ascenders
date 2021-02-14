const { Client, Message, MessageEmbed } = require("discord.js");

const { tictactoe } = require("reconlx");

module.exports = {
  name: "say",
  description: "repeats you",
  usage: "say",
  enabled: true,
  aliases: [],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

  async execute(client, message, args, data) {
    const sayEmbed = new MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dyanmic: true })
      )
      .setDescription(args.join(" "))
      .setTimestamp()
      .setColor("RANDOM");

    message.channel.send(sayEmbed);
  }
};
