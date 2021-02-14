const { MessageEmbed } = require('discord.js')
const archieembed = require("../../util/archieembed")


module.exports = {
    name: "membercount",
  description: "No of members in the server",
  usage: "",
  enabled: true,
  aliases: [],
  category: "Utility",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        message.channel.send(`This discord server has ${message.guild.memberCount} members`);
    }
}