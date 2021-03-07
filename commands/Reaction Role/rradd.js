const { Discord, MessageEmbed } = require('discord.js')
const moment = require('moment')
const pagination = require('discord.js-pagination');
const db = require('../../reconDB');

module.exports = {

    //Information about command
    name: "rradd",
    description: "Adds a given Emoji to the server",
    usage: "[emoji]",
    enabled: true,
    aliases: ["stealemoji"],
    category: "Moderation",
    memberPermissions: ["MANAGE_GUILD"],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`**YOU MUST HAVE PERMISSIONS.**`)
        let channel = message.mentions.channels.first();
        if (!channel) return message.channel.send(`${data.guild.prefix}rradd <#channeL> <MESSAGEID> <ROLE> <EMOJI>`)
        if (!args[1]) return message.channel.send(`${data.guild.prefix}rradd ${channel} <MESSAGEID> <ROLE> <EMOJI>`)
        
        const channelcheck = message.guild.channels.cache.get(channel)
        const messageid = channelcheck.message.fetch(args[1])
        //let messageid = client.channels.cache.get(channel.id).messages.fetch(args[1])
        if (!messageid) return message.channel.send(`**That's not an vaild message iD** `)

        if (isNaN(args[1])) return message.channel.send(`Message ID Must Be ANumber`)

        let role = message.mentions.roles.first();
        if (!role) return message.channel.send(`${data.guild.prefix}rradd ${channel} ${args[1]} <@role> <Emoji> `)
        let check = message.guild.roles.cache.find(r => r.name === `${role.name}`)
        if (!check) return message.channel.send(`invaild role!`)
        if (!args[3]) return message.channel.send(`${data.guild.prefix}rradd ${channel} ${args[1]} ${role.name} <EMOJI> `)
        function isCustomEmoji(emoji) {
            return emoji.split(":").length == 1 ? false : true;
        }
        if (isCustomEmoji(args[3])) {
            let customemoji = Discord.Util.parseEmoji(args[3]);
            let emojicheck = client.emojis.cache.find(emoji => emoji.id === `${customemoji.id}`);
            if (!emojicheck) return message.channel.send(`this emoji is invaild!`)
            let embed = new Discord.MessageEmbed()
                .setThumbnail(message.guild.iconURL())
                .setTitle(`Reaction Role Sucsses!`)
                .setDescription(`**Done!**
 
 **[Go To Message](https://discord.com/channels/${message.guild.id}/${channel.id}/${args[1]})
 Role : ${role}
 [Emoji](https://cdn.discordapp.com/emojis/${emojicheck.id}.png?v=1) : ${emojicheck}
 Channel : ${channel}**
 `)
                .setTimestamp()
                .setFooter(message.guild.name, message.guild.iconURL())

            message.channel.send(embed)
            client.channels.cache.get(`${channel.id}`).messages.fetch(`${args[1]}`).then(a => {
                a.react(emojicheck.id)
                db.set(`rrremove_${message.guild.id}_${args[1]}2`, channel.id)
                db.set(`rrremove_${message.guild.id}_${args[1]}_${args[3]}`, emojicheck.id)
                db.set(`rerremove_${message.guild.id}_${args[1]}`, args[1])
                db.set(`emoteid_${message.guild.id}_${emojicheck.id}`, emojicheck.id)
                db.set(`role_${message.guild.id}_${emojicheck.id}`, role.id)
                db.set(`message_${message.guild.id}_${emojicheck.id}`, args[1])
                return;
            })
            return;
        }
        db.set(`rrremove_${message.guild.id}_${args[1]}2`, channel.id)
        db.set(`rrremove_${message.guild.id}_${args[1]}_${args[3]}`, args[3])
        db.set(`rerremove_${message.guild.id}_${args[1]}`, args[1])
        db.set(`emoteid_${message.guild.id}_${args[3]}`, args[3])
        db.set(`role_${message.guild.id}_${args[3]}`, role.id)
        db.set(`message_${message.guild.id}_${args[3]}`, args[1])
        let embed = new MessageEmbed()
            .setThumbnail(message.guild.iconURL())
            .setTitle(`Reaction Role Sucsses!`)
            .setDescription(`**Done!**
     
     **[Go To Message](https://discord.com/channels/${message.guild.id}/${channel.id}/${args[1]})
     Role : ${role}
     Emoji: ${args[3]}
     Channel : ${channel}**
     `)
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL())

        message.channel.send(embed)
        client.channels.cache.get(`${channel.id}`).messages.fetch(`${args[1]}`).then(a => {
            a.react(args[3])
        })
    }
}