
const schema = require('../../models/UserProfileECO.js')
const items = require('../../util/items.js')
const Discord = require('discord.js')
module.exports = {
  name: "ecosearch",
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
    let places = [
      "bushes",
      "roadside",
      "sever",
      "pocket",
      "kitchen",
      "doormat",
      "trunk",
      "garden",
      "mattress",
      "tumbler",
      "backpack"
    ]
    const eco = await schema.findOne({
      userID: message.author.id
    })
    if (!eco) return message.channel.send("You haven't created your profile yet! Use `/s start` to create your profile and start playing!")
    let choose = (arr, things) => {
      let random = arr[Math.floor(Math.random() * arr.length)];
      if (things.includes(random)) {
        return choose(arr, things);
      } else {
        return random;
      }
    }
    let i;
    let chosen = [];
    for (i = 0; i < 3; i++) {
      choosen = choose(places, chosen);
      chosen.push(choosen)
    }
    message.channel.send(`Where would you like to search?\n\`${chosen.join('`, `')}\``)
    const filter = m => m.author.id === message.author.id;
    let collector = message.channel.createMessageCollector(filter, { max: 1 })
    collector.on('collect', async () => {
      return;
    })
    collector.on("end", collected => {
      if (!chosen.includes(collected.first().content)) return message.channel.send("That is not a valid option!")
      let answer = collected.first().content
      let rewards = `${Math.floor(Math.random() * 10)} ${items.filter(i => !i.canUse)[Math.floor(Math.random() * items.length)].name || items.filter(i => !i.canUse)[Math.floor(Math.random() * items.length)].name}(s)`
      let answers = [
        `You searched \`${answer}\` and found \`${rewards}\`!`,
        `You searched \`${answer}\` but couldnt find anything, aw`,
        `You found \`${rewards}\` after searching \`${answer}\``
      ]
      message.channel.send(answers[Math.floor(Math.random() * answers.length)])
      if (eco.inventory.find(z => z.name === rewards.slice(2).split('(')[0])) {
        const amount = rewards.slice(0, 1)
        eco.inventory.find(z => z.name === rewards.slice(2).split('(')[0]).amount += amount
        const newData = new schema(eco).save();
      } else {
        const amount = rewards.slice(0, 1)
        const item = items.find(z => z.name === rewards.slice(2).split('(')[0])
        eco.inventory.push({ name: item.name, id: item.id, amount: amount, description: item.description })
        const newData = new schema(eco).save();
      }
    })
  }
}