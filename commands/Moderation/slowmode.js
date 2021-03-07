const archieembed = require("../../util/archieembed")
const { MessageEmbed } = require('discord.js');
const ms = require('ms')

module.exports = {
    name: "slowmode",
    description: "Set the slowmode of a channel.",
    usage: "slowmode [seconds]",
    enabled: true,
    aliases: [],
    category: "Utility",
    memberPermissions: ['MANAGE_CHANNELS'],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {

        if (!args[0]) return archieembed(`Invalid command usage, try using it like: \n \`${data.guild.prefix}slowmode [time] (reason)\` \n\n Arguments: \n \`time\`: **Time in second or hours(may include spaces)**\n\`reason\`: **reason (may include spaces)**\n\n**Example:** \`${data.guild.prefix}slowmode 1hr Spamming\`\nTo disable it use \`${data.guild.prefix}slowmode off\``, message.channel)

        const currentSlowmode = message.channel.rateLimitPerUser;

        const reason = args[1] ? args.slice(1).join(' ') : 'No reason specified'

        const embed = new MessageEmbed()
            .setFooter(`Command used by ${message.author.tag} | ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }))

        if (args[0] === 'off') {
            if (currentSlowmode === 0) return archieembed(`Channel slowmode is aldready off`, message.channel)

            embed.setTitle(`Slowmode Disabled`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(`#00ff00`)

            return message.channel.setRateLimitPerUser(0, reason).then(m => m.send(embed))
        }

        const time = ms(args[0]) / 1000

        if (isNaN(time)) return archieembed(`Not a valid Time`, message.channel)

        if (time > 21600) return archieembed(`Slowmode cannot be more than 6 hours`, message.channel)

        if (currentSlowmode === time) return archieembed(`Slowmode is aldready set to ${args[0]}`, message.channel)

        embed.setTitle(`Slowmode Enabled`)
            .addField(`Slowmode`, args[0])
            .addField(`Reason`, reason)
            .setColor('#ff0000')

        message.channel.setRateLimitPerUser(time, reason).then(m => m.send(embed))

    }
}