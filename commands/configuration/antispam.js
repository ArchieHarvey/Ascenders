const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('../../reconDB');
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "antispam",
  description: "Tells which role autorole is set to",
  usage: "",
  enabled: true,
  aliases: [],
  category: "Utility",
  memberPermissions: ["MANAGE_MESSAGES"],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        if (!args[0]) return archieembed('u want to enable or disable?', message.channel)
        if (args[0] === 'enable') /*{
            await db.set(`antispam-${message.guild.id}`, true)
            archieembed('Antispam activated', message.channel)*/
            if(await db.has(`antispam-${message.guild.id}`) === false) {
            
                await db.set(`antispam-${message.guild.id}`, true)
                archieembed('Antispam activated', message.channel)
    
            } else return archieembed('Antispam is aldready activated', message.channel)
        
         else if (args[0] === 'disable') /*{
            await db.delete(`antispam-${message.guild.id}`)
            archieembed('Antispam deactivated', message.channel)*/
            if(await db.has(`antispam-${message.guild.id}`) === true) {
            
                await db.delete(`antispam-${message.guild.id}`);
                archieembed('Antispam deactivated', message.channel)
    
            } else return archieembed('Antispam is already deactivated', message.channel)
        
    }
}