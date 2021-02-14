const { MessageEmbed } = require("discord.js");
const archieembed = require("../../util/archieembed")

module.exports = {

  //Information about command
  name: "clear",
  description: "clears messages between 2-99",
  usage: "[number]",
  enabled: true,
  aliases: ['purge'],
  category: "Moderation",
  memberPermissions: ['MANAGE_MESSAGES'],
  botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

  //Execute to command once the settings have been checked
  async execute(client, message, args, data) {
    if (!args[0]) return message.channel.send('Please specify a number of messages to delete ranging from 1 - 99')
    if (isNaN(args[0])) return message.channel.send('Numbers are only allowed')
    if (parseInt(args[0]) > 99) return message.channel.send('The max amount of messages that I can delete is 99')
    await message.channel.bulkDelete(parseInt(args[0]) + 1)
      .catch(err => console.log(err))
    message.channel.send('Deleted ' + args[0] + " messages.")

  }
}