const db = require('../../models/warns')
const { Message, MessageEmbed } = require('discord.js')
const archieembed = require("../../util/archieembed")

module.exports = {

    //Information about command
    name: "warn",
    description: "warns the mentioned user",
    usage: "warn <@user>",
    enabled: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: ['MANAGE_MESSAGES'],
    botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {
        
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        
        if (!member)
            return archieembed(`Invalid command usage, try using it like: \n \`${data.guild.prefix}warn [member] (optional reason)\` \n\n Arguments: \n \`member\`: *User mention (@User) or User ID* \n \`reason\`: *Text (may include spaces)*`, message.channel)
            if (member === member.user.bot) 
            return archieembed('You cannot warn a bot', message.channel)
        if (member === message.member)
            return archieembed('You cannot warn yourself', message.channel)
        if (member.user.id === message.guild.ownerID)
            return archieembed(`You can\'t warn the owner of the server!`, message.channel)
        if (member.roles.highest.position >= message.member.roles.highest.position)
            return archieembed('You cannot warn someone with an equal or higher role than you.', message.channel)
        let reason = args.slice(1).join(" ")
        if (!reason) reason = '`No reason specified!`';
        if (reason.length > 1024) reason = reason.slice(0, 1021) + '...'
        
        db.findOne({ guildid: message.guild.id, user: member.user.id}, async(err, data) => {
            if(err) throw err;
            if(!data) {
                data = new db({
                    guildid: message.guild.id,
                    user : member.user.id,
                    content : [
                        {
                            moderator : message.author.id,
                            reason : reason
                        }
                    ]
                })
            } else {
                const obj = {
                    moderator: message.author.id,
                    reason : reason
                }
                data.content.push(obj)
            }
            data.save()
        });
        member.send(new MessageEmbed()
            .setDescription(`You have been warned for ${reason}`)
            .setColor("RED")
        ).catch(() => message.reply(`Couldn't send the warn to ${member}'s DM!`))
        message.channel.send(new MessageEmbed()
            .setDescription(`Warned ${member}`)
            .addField('Username', member.user.username, true)
            .addField('User ID', member.id, true)
            .addField('Warned by', message.author, true)
            .addField('Reason', reason)
            .setColor('BLUE')
        )
    }
}