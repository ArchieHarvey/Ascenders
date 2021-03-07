const db = require('../../models/warns')
const { Message, MessageEmbed } = require('discord.js')

module.exports = {

    //Information about command
    name: "infractions",
    description: "gets the warns for the user",
    usage: "warns <@user>",
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
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user) return archieembed(`Invalid command usage, try using it like: \n \`${data.guild.prefix}infractions [member] (optional reason)\` \n\n Arguments: \n \`member\`: *User mention (@User) or User ID* \n \`reason\`: *Text (may include spaces)*`, message.channel)
        const reason = args.slice(1).join(" ")
        db.findOne({ guildid: message.guild.id, user: user.user.id}, async(err, data) => {
            if(err) throw err;
            if(data) {
                message.channel.send(new MessageEmbed()
                    .setTitle(`${user.user.tag}'s warns`)
                    .setAuthor(user.user.username, user.user.displayAvatarURL())
                    .setDescription(
                        data.content.map(
                            (w, i) => 
                            `\`${i + 1}\` | Moderator : <@${message.guild.members.cache.get(w.moderator).user.id}> (${message.guild.members.cache.get(w.moderator).user.id}) \nReason : \`${w.reason}\``
                        )
                    )
                    .setColor("BLUE")
                )
            } else {
                message.channel.send({embed: {
                    color: "BLUE",
                    author: {
                                name: user.user.username,
                                icon_url: user.user.displayAvatarURL()
                              },
                    description: 'This user does not have any warns in this server!',
                    timestamp: new Date(),
                    footer: {
                                  icon_url: client.user.displayAvatarURL(),
                                  text: `© Ascenders ${new Date().getFullYear()}`
                }}
                })
            }

        })
    }
}