const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('../../reconDB');
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "autorole-check",
  description: "Tells which role autorole is set to",
  usage: "",
  enabled: true,
  aliases: [""],
  category: "Utility",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        const check = await db.has(`autorole-${message.guild.id}`);
        if(check === false) return archieembed('There is no autorole set!', message.channel);
        const role = await db.get(`autorole-${message.guild.id}`);
        archieembed(`The autorole is <@&${role}>`, message.channel);
    }
}