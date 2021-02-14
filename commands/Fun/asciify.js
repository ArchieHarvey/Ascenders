const Discord = require('discord.js')
var access = require("request");


module.exports = {
  name: "asciify",
description: "Converts text to ascii characters",
usage: "asciify [text]",
enabled: false,
aliases: [""],
category: "Utility",
memberPermissions: [],
botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
//Settings for command
nsfw: false,
ownerOnly: false,
cooldown: 0,

  async execute(client, message, args, data){

    // Variables
    let words = args.join(" ");
    const msg = message

        // Input Checking
        const noInputErr = new Discord.MessageEmbed()
          .setDescription('Error! This command requires you to input a text!')
          .setColor('RED')
        if (!words) return message.channel.send(noInputErr);

        const textLength = new Discord.MessageEmbed()
          .setDescription('Error! The input arguement cannot be over the 15 character limit!')
          .setColor('RED')
        if (words.length > 15) return message.channel.send(textLength)

        // Executing
        access("https://artii.herokuapp.com/make?text=" + words, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            message.channel.send("\n```" + body + "```");
          }
          else {
            message.channel.send("An Unexpected Error Happened");
          }
        });
      }
    }