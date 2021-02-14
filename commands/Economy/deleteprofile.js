

const schema = require('../../models/UserProfileECO.js')
const Discord = require('discord.js')
const items = require('../../util/items.js')
const itemOne = items.find(z => z.name === "Common Leaf")
const itemTwo = items.find(z => z.name === "Short Stick")
const itemThree = items.find(z => z.name === "Pebble")
module.exports = {
  name: "deleteprofile",
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
    if(!eco) return message.channel.send(`You havent created a profile yet! Use \`${data.guild.prefix}profilecreate\` to create a profile and start playing!`)
    message.channel.send("Are you sure you want to delete your profile from our database?(It will erase all of your profile and reset your progress!) Type `yes` for yes and `no` for no")
    const filter = m => m.author.id === message.author.id && m.channel.id === message.channel.id
    message.channel.awaitMessages(filter, { max: 1 }).then(async (collected) => {
        msg = collected.first()
        if(msg.content.toLowerCase() != "yes")  return message.channel.send("Alright lets pretend that never happened");
        await schema.findOneAndDelete({
            userID: message.author.id
        })
        message.channel.send("You have successfully deleted your profile from our database! Use `/s start` so start again!")
    })
  }
}