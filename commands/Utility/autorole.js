
const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('../../reconDB');
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "autorole",
  description: "Sets role when someone joins",
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
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if(!role) return archieembed('Role is not valid!', message.channel)

        await db.set(`autorole-${message.guild.id}`, role.id);
        message.reply(`${role.name} is the autorole!`)
    }
}