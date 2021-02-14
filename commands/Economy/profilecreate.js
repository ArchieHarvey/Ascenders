

const schema = require('../../models/UserProfileECO.js')
const Discord = require('discord.js')
const items = require('../../util/items.js')
const itemOne = items.find(z => z.name === "Common Leaf")
const itemTwo = items.find(z => z.name === "Short Stick")
const itemThree = items.find(z => z.name === "Pebble")
module.exports = {
  name: "profilecreate",
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
    eco = await schema.findOne({
        userID: message.author.id
    })
    if(!eco) {
        message.channel.send("You have created your profile!")
        newData = new schema({
            userID: message.author.id,
            inventory: [{ name: itemOne.name, id: itemOne.id, amount: 20, description: itemOne.description },{ name: itemTwo.name, id: itemTwo.id, amount: 15, description: itemTwo.description },{ name: itemThree.name, id: itemThree.id, amount: 10, description: itemThree.description }],
            pocketBalance: 1000,
            hideoutBalance: 0,
            netWorth: 0,
            level: 0,
            createdAt: new Date()
        })
        newData.save()
    } else if(data) {
        return message.channel.send("You have already created an account! Use `/s deleteprofile` to delete your profile and start fresh!")
    }
  }
}