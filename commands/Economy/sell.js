

const items = require('../../Util/items.js')
const schema = require('../../models/UserProfileECO.js')

module.exports = {
  name: "sell",
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
    if(!args[0]) return message.channel.send("You didnt provide an item!")
    if(!items.find(z => z.id === args[0])) return message.channel.send("You didnt probide a valid item!")
    if(items.find(z => z.id ===args[0]).sellAmount === 0) return message.channel.send("You cant sell this item!")
    if(isNaN(args[1])) return message.channel.send("You need to provide a number!")
    const eco = await schema.findOne({
        userID: message.author.id
    })
    if(!eco) return message.channel.send("You havent created a profile yet! Use `/s start` to create your profile and start playing!")
    if(!eco.inventory.find(z => z.id === args[0])) return message.channel.send("You dont own this item!")
    const amount = eco.inventory.find(z => z.id === args[0]).amount - parseInt(args[1])
    if(amount < 0) return message.channel.send("You cant sell more than you own!")
    eco.inventory.find(z => z.id === args[0]).amount -= args[1]
    if(eco.inventory.find(z => z.id === args[0]).amount === 0) {
        const money = parseInt(args[1]) * items.find(z => z.id === args[0]).sellAmount
        eco.pocketBalance += money
        eco.inventory.splice(eco.inventory.indexOf(eco.inventory.find(z => z.id === args[0])), (eco.inventory.indexOf(eco.inventory.find(z => z.id === args[0]))) +1)
        newData = await new schema(eco).save()
        message.channel.send(`You sold ${items.find(z => z.id === args[0]).name} and now have ${newData.pocketBalance} in your pocket!`)
    }else if(eco.inventory.find(z => z.id === args[0]).amount >> 0) {
        const money = parseInt(args[1]) * items.find(z => z.id === args[0]).sellAmount
        eco.pocketBalance += money
        newData = await new schema(eco).save()
        message.channel.send(`You sold ${items.find(z => z.id === args[0]).name} and now have ${newData.pocketBalance} in your pocket!`)
    }
  }
}