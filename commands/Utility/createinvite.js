
const Discord = require('discord.js')

module.exports = {
    name: "createinvite",
    description: "Generate an invite link!",
    usage: "createinvite {perm}",
    enabled: false,
    aliases: [],
    category: "Utility",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        let time;
        let timeInfo;
        if (args[0] == 'permanent' || args[0] == 'perm') {
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You must have the Administrator permission to make a permanent invite link or manually make it!\nThis is done to prevent misuse of invites.')
            time = 0
            timeInfo = 'is permanent!'
        } else {
            time = 86400
            timeInfo = 'will expire in 1 day!'
        }

        message.channel.createInvite({
            unique: true,
            maxAge: time
        })
            .then(invite => {
                const Embed = new Discord.MessageEmbed()
                    .setTitle('Invite Link Generated')
                    .setDescription('Hi there!\nHere\'s your invite link: https://discord.gg/' + invite.code)
                    .setFooter(`This link ${timeInfo}`)
                    .setColor(3426654)
                message.channel.send(Embed)
            })
            .catch(console.error)
    }
}