const items = require('../../Util/items.js')
const Discord = require('discord.js')

module.exports = {
  name: "shop",
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
    if(!args[0]) {
        const buyable = []
        items.forEach((i) => {
            if(!i.canBuy) return;
            buyable.push(i)
        })
        const final = buyable[0] ? buyable.map(z => `${z.name} - ${z.price}\n${z.description}`) : "Nothing in the shop! Check back later"
        const embed = new Discord.MessageEmbed()
        .setTitle(`${buyable[0] ? "":final}`)
        .setDescription(`${buyable[0] ? final : ""}`)
        message.channel.send(embed)
    }else if(args[0]) {
        const item = items.find(z => z.id === args[0])
        if(!item) return message.channel.send("That isnt a valid item!")
        const embed = new Discord.MessageEmbed()
        .setTitle(item.name)
        .addField(name=item.description, value=`Buy Price - ${item.price == 0 ? "Cannot be bought" : item.price}\nSell Price - ${item.sellAmount == 0 ? "Cannot be sold" : item.sellAmount}`)
        .setColor("RANDOM")
        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: 'png' }))
        message.channel.send(embed)}
  }
}