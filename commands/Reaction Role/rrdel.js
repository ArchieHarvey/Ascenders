const { Discord, MessageEmbed } = require('discord.js')
const db = require('../../reconDB');

module.exports = {

    //Information about command
    name: "rrdelete",
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
        if (!args[0]) return message.channel.send(`${data.guild.prefix}rrdelete (messageid) (emoji)`)
        let channel = await db.get(`rrremove_${message.guild.id}_${args[0]}2`)
        let messageid = await db.get(`rerremove_${message.guild.id}_${args[0]}`)

        if (!channel) return message.channel.send(`**Message ID Not Found**`)
        if (!messageid) return message.channel.send(`**MessageID Not Found**`)
        let a = client.channels.cache.get(channel).messages.fetch(args[0])
        if (!a) return message.channel.send(`**That's Message ID Invaild**`)
        if (!args[1]) return message.channel.send(`${data.guild.prefix}rrdelete (mesageid) (emoji)`)
        function isCustomEmoji(emoji) {
            return emoji.split(":").length == 1 ? false : true;
        }
        if (isCustomEmoji(args[1])) {

            let customemoji = Discord.Util.parseEmoji(args[1]);
            let emojicheck = client.emojis.cache.find(emoji => emoji.id === `${customemoji.id}`);
            if (!emojicheck) return message.channel.send(`this emoji is invaild!`)

            let emote = await db.get(`rrremove_${message.guild.id}_${args[0]}_${args[1]}`)
            if (!emote) return message.channel.send(`theres no emojis with ${emojicheck} on ${args[0]}`)
            client.channels.cache.get(channel).messages.fetch(args[0]).then(darkcodes => {
                darkcodes.reactions.cache.get(`${emojicheck.id}`).remove()
            })

            let embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription(`**Sucsses**
        Removed  **[Go To Message](https://discord.com/channels/${message.guild.id}/${channel}/${args[0]})**
      Reaciton Cleared 
      Reaciton Role Removed.`)
                .setFooter(message.guild.name, message.guild.iconURL())
                .setTimestamp()
            message.channel.send(embed)
            db.delete(`emoteid_${message.guild.id}_${emojicheck}`)
            db.delete(`emojistatus_${args[0]}_${args[1]}`)
            db.delete(`role_${message.guild.id}_${emojicheck}`)
            db.delete(`message_${message.guild.id}_${emojicheck}`)
            db.delete(`rrremove_${message.guild.id}_${args[0]}2`)
            db.delete(`rrremove_${message.guild.id}_${args[0]}_${args[1]}`)
            db.delete(`rerremove_${message.guild.id}_${args[0]}`)
            return;
        }
        client.channels.cache.get(channel).messages.fetch(args[0]).then(darkcodes => {
            darkcodes.reactions.cache.get(`${args[1]}`).remove()
        })

        let embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription(`**Sucsses**
           Removed  **[Go To Message](https://discord.com/channels/${message.guild.id}/${channel}/${args[0]})**
         Reaciton Cleared 
         Reaciton Role Removed.`)
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp()
        message.channel.send(embed)
        db.delete(`emojistatus_${args[0]}_${args[1]}`)
        db.delete(`emoteid_${message.guild.id}_${args[1]}`)
        db.delete(`role_${message.guild.id}_${args[1]}`)
        db.delete(`message_${message.guild.id}_${args[1]}`)
        db.delete(`rrremove_${message.guild.id}_${args[0]}2`)
        db.delete(`rrremove_${message.guild.id}_${args[0]}_${args[1]}`)
        db.delete(`rerremove_${message.guild.id}_${args[0]}`)
    }
}