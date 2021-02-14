const archieembed = require("../../util/archieembed")
const config = require('../../config.json')
const { MessageAttachment } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: "clyde",
  description: "Shows your text as Clyde\'s message",
  usage: "clyde <text>",
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
    const text = args.slice().join(' ');
    if (!text) {
        return message.channel.send(
            '❎ Please provide valid text.',
        );
    }

    const url = `https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`;

    let response;
    try {
        response = await fetch(url).then(res => res.json());
    }
    catch (e) {
        return message.channel.send('❎ An error occured, please try again!');
    }
    const attachment = new MessageAttachment(response.message, 'clyde.png');
    return message.channel.send(attachment);
  }
}
