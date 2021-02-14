
const schema = require('../../models/UserProfileECO.js')
const Discord = require('discord.js')
module.exports = {
  name: "inventory",
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
  if(!eco) return message.channel.send("You havent created your profile yet! Use `/s start` to create your profile and start playing!")
  if(!eco.inventory[0]) return message.channel.send("You dont have any items in your inventory!")
  const embed = new Discord.MessageEmbed()
  .setTitle(`${message.author.username}'s Inventory!`)
  .setColor("RANDOM")
  .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: 'png' }))
  let i=0;
  let ii=0;
  let object = {};
  object[ii] = []
  for(i=0;i<eco.inventory.length;i++){
      if(Math.floor(i/6)>ii) ii++
      if(!object[ii]) object[ii] = []
      object[ii].push(eco.inventory[i])
  }
  number = object[`${(parseInt(args[0]) - 1)}`] ? (parseInt(args[0]) - 1) : 0;
  object[`${number}`].forEach((a) => {
      embed.addField(`**${a.name} - ${a.amount}**`, `**_ID: _\`${a.id}\`**`)
  })
  message.channel.send(embed)
  }
}