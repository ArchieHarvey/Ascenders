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
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_WEBHOOKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {

        let embed = new MessageEmbed()
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor("RED")
            .setTimestamp();

        if (!args[0]) {
            embed.setDescription(`Invalid command usage, try using it like: \n \`${data.guild.prefix}sudo [mention] [text]\` \n\n Arguments: \n \`mention\`: *someone* \n\`text\`: *text(may include spaces)*`)
            return message.channel.send(embed)}

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        if (!member) return message.channel.send(embed.setDescription(`Couldn't find this user!`))

        if (!args[1]) return message.channel.send(embed.setDescription(`Invalid command usage, try using it like: \n \`${data.guild.prefix}sudo [mention] [text]\` \n\n Arguments: \n \`mention\`: *someone* \n\`text\`: *text(may include spaces)*`, message.channel))
        
        message.channel.createWebhook(member.user.username, {
            avatar: member.user.displayAvatarURL({ dynamic: true })
        }).then(webhook => {
            webhook.send(args.slice(1).join(' '), { disableMentions: 'everyone' })
            setTimeout(() => {
                webhook.delete()
            }, 3000)
        })
    }
}