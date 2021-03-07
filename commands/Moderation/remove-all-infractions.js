const db = require('../../models/warns')
const archieembed = require("../../util/archieembed")
const config = require("../../config.json")

module.exports = {

    //Information about command
    name: "remove-all-infractions",
    description: "remove all infractions of a user",
    usage: "remove-all-infractions",
    enabled: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_MESSAGES"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) return archieembed(`${config.denied} Invalid command usage, try using it like: \n \`${data.guild.prefix}remove-all-infraction [member] (optional reason)\` \n\n Arguments: \n \`member\`: **User mention (@User) or User ID** \n \`reason\`: **Text (may include spaces)**`, message.channel)
        db.findOne({ guildid : message.guild.id, user: user.user.id}, async(err,data) => {
            if(err) throw err;
            if(data) {
                await db.findOneAndDelete({ user : user.user.id, guildid: message.guild.id})
                message.channel.send({embed: {
                    color: "BLUE",
                    author: {
                                name: user.user.username,
                                icon_url: user.user.displayAvatarURL()
                              },
                    description: `${config.approved} Cleared <@${user.user.id}>'s (${user.user.id}) warns`,
                    timestamp: new Date(),
                    footer: {
                                  icon_url: client.user.displayAvatarURL(),
                                  text: `© Ascenders ${new Date().getFullYear()}`
                }}
                })
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