const giveawayClient = require('../../client');
const { Client, Message, MessageEmbed } = require('discord.js');
const ms = require('ms');
const { channels } = require('../../ascenders');

module.exports = {
    name: "gstart",
  description: "starts a giveaway",
  usage: "waifu",
  enabled: true,
  aliases: [],
  category: "Anime",
  memberPermissions: ["MANAGE_MESSAGES"],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,
  
    async execute(client, message, args, data){

        const channel = message.mentions.channels.first();
        if(!channel) return message.reply("please mention a channel")

        let time = args[1]; if (!time) return message.reply("mention time")
        time = ms(time);

        giveawayClient.start({
            channel,
            time,
            hostedBy: message.author,
            description: "a random giveaway",
            winners: parseInt(args[2]),
            prize: args.slice(3).join(" ")
        });

    }
}