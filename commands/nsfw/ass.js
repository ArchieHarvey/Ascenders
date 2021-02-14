const superagent = require("node-fetch");
const Discord = require('discord.js')

const rp = require('request-promise-native');

module.exports = {
  name: "ass",
  description: "Get a life.",
  usage: "ass",
  enabled: true,
  aliases: [],
  category: "NSFW",
  memberPermissions: [],
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  //Settings for command
  nsfw: true,
  ownerOnly: false,
  cooldown: 0,

  async execute(client, message, args, data) {
    //command

    //Checks channel for nsfw
    /*var errMessage = "This is not an NSFW Channel";
    if (!message.channel.nsfw) {
        message.react('💢');
  
        return message.reply(errMessage)
        .then(msg => {
        msg.delete({ timeout: 3000 })
        })
        
    }*/

    return rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse).then(function (res) {
      return rp.get({
        url: 'http://media.obutts.ru/' + res[0].preview,
        encoding: null
      });
    }).then(function (res) {

      const ass = new Discord.MessageEmbed()
        .setTitle(":underage: Ass")
        .setColor(`#FF0000`)
        .setImage("attachment://file.png").attachFiles([{ attachment: res, name: "file.png" }])


      message.channel.send(ass);
    });
  }
};