const { Client, Message, MessageEmbed } = require('discord.js');
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "sudo",
    description: "Make anyone say anything!",
    usage: "say",
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
        
          if (!args[0]) return archieembed(`Invalid command usage, try using it like: \n \`${data.guild.prefix}sudo [mention] [text]\` \n\n Arguments: \n \`mention\`: *someone* \n\`text\`: *text(may include spaces)*`, message.channel)
          
         
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return archieembed(`Couldn't find this user!`, message.channel)
        if (!args[1]) return archieembed(`Invalid command usage, try using it like: \n \`${data.guild.prefix}sudo [mention] [text]\` \n\n Arguments: \n \`mention\`: *someone* \n\`text\`: *text(may include spaces)*`, message.channel)
        message.channel.createWebhook(member.user.username, {
            avatar: member.user.displayAvatarURL({ dynamic: true })
        }).then(webhook => {
            webhook.send(args.slice(1).join(' '))
            setTimeout(() => {
                webhook.delete()
            }, 3000)
        })
    }
}