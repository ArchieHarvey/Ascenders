
const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('../../reconDB');
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "autoroledelete",
  description: "Deletes the server autorole from database",
  usage: "[role]",
  enabled: true,
  aliases: [],
  category: "Utility",
  memberPermissions: ["ADMINISTRATOR"],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){

      const member = message.mentions.members.first();
      

        if(!message.member.hasPermission('ADMINISTRATOR')) return archieembed('You need `ADMINISTRATOR` permission to use this command!', message.channel);
        
        archieembed(`Autorole Has been diabled\nTo enable again you would have to set autorole again!`, message.channel)
        await db.delete(`autorole-${message.guild.id}`);
        
    }
}