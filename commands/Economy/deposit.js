
const schema = require('../../models/UserProfileECO.js')
module.exports = {
  name: "deposit",
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
    if(!args[0]) return message.channel.send("You need to specify money to deposit!")
    if(isNaN(parseInt(args[0]))) return message.channel.send("You need to specify a valid number!")
    const eco = await schema.findOne({
        userID: message.author.id
    }) 
    if(!eco) return message.channel.send("You havent created your profile yet! Use `/s start` to create your profile and start playing!")
    if(eco.pocketBalance === 0) return message.channel.send("You dont have enough money to withdraw")
    if(eco.pocketBalance < parseInt(args[0])) return message.channel.send("You cant deposit more than you have!")
    eco.pocketBalance-=parseInt(args[0])
    eco.hideoutBalance+=parseInt(args[0])
    neweco = await new schema(eco).save()
    message.channel.send(`You deposited ${args[0]} and now have ${neweco.pocketBalance} in your pocket`)
   
  }
}