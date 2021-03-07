const Discord = require('discord.js')
const afkSchema = require('../../models/afkSchema')

/**
 * @type {import('../../typings.d').Command}
 */
module.exports = {
    name: "afk",
    description: "Sets you status as afk",
    usage: "afk <reason>",
    enabled: true,
    aliases: [],
    category: "Utility",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_NICKNAMES"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) { //Adapt to your handler
        let afkMessage = args.join(' ')
        let userId = message.author.id
        let guildId = message.guild.id

        const embed = new Discord.MessageEmbed()


        if (!afkMessage) {
            afkMessage = 'AFK' //Define AFK message
        }

        await afkSchema.findOneAndUpdate({ //Update AFK message
            guildId: message.guild.id,
            userId: message.author.id
        }, {
            guildId: message.guild.id,
            userId: message.author.id,
            $set: {
                afk: afkMessage,
                timestamp: new Date().getTime(),
                username: message.member.nickname === null ? message.author.username : message.member.nickname //Keep Old Username
            }
        }, {
            upsert: true,
        })

        await message.member.setNickname(`[AFK] ${message.member.nickname === null ? `${message.author.username}` : `${message.member.nickname}`}`).catch((e) => {
            console.log('No Permissions')
        }) //In case bot doesnt have perms

        return message.channel.send(embed
            .setColor(message.guild.me.displayColor)
            .setAuthor(`Your AFK Message Has Been Set`, message.author.displayAvatarURL())
            .setDescription(`\`${afkMessage}\``)
            .setTimestamp())
    }
}

