

const schema = require('../../models/UserProfileECO.js')
const Discord = require('discord.js')

module.exports = {
  name: "bal",
  description: "Play connect 4 against another user",
  usage: "connectfour <user>",
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
    const eco = await schema.findOne({
      userID: message.author.id
    })
    if (!eco) return message.channel.send(`You havent created your profile yet! Use \`${data.guild.prefix}profilecreate\` to create your profile and start playing!`)
    const embed = new Discord.MessageEmbed()
      .setTitle(`${message.author.username}'s Balance!`)
      .setDescription(`Pocket: ${eco.pocketBalance}\nHideout: ${eco.hideoutBalance}\nNet Worth: Feature to be added soon!`)
      .setColor("RANDOM")
    message.channel.send(embed)
  }
}