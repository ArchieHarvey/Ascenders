const items = require('../../Util/items.js')
const Discord = require('discord.js')
const schema = require('../../models/UserProfileECO.js')
module.exports = {
  name: "use",
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
    const item = items.find(z => z.id == args[0])
    if(!item) return message.channel.send("That isnt a valid item!")
    if(!item.canUse) return message.channel.send("You cant use this item :thinking:")
    const eco = await schema.findOne({
        userID: message.author.id
    })
    if(!eco) return message.channel.send("You havent created your profile yet! Use `/s start` to create your profile and start playing!")
    if(!eco.inventory.find(z => z.id === args[0])) return message.channel.send("You dont own this item!")
    if(eco.inventory.find(z=>z.id===args[0]).amount < parseInt(args[1])) return message.channel.send(`You only have ${eco.inventory.find(z => z.id===args[0]).amount} ${eco.inventory.find(z => z.id === args[0]).name}((e)s)`)
    item.run(bot, message, args, schema)
  }
}