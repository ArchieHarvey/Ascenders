const { MessageEmbed, MessageCollector } = require("discord.js")

module.exports = {
    name: "shutdown",
    description: "list of servers",
    usage: "servers",
    enabled: true,
    aliases: [],
    category: "Owner",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: true,
    cooldown: 0,

    async execute(client, message, args, data) {
        if (message.author.id !== '426677001152102400') return; //Remove this if u use wokcommands handler

        const aEmbed = new MessageEmbed()
            .setColor('YELLOW')
            .setDescription('[:timer:1m] | Do you want to shutdown the bot. | [yes/no]')
        //Command Confirmed
        const bEmbed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('Command Confirmed')
            .setDescription('Bot Shutted Down.')
        //Command Cancel
        const cEmbed = new MessageEmbed()
            .setColor('RED')
            .setTitle('Command Canceled')
            .setDescription('The command was Canceled')
        //end
        message.channel.send(aEmbed)

        const collector = new MessageCollector(message.channel, msg => msg.author.id === message.author.id, {
            time: 1000 * 60
        })

        collector.on('collect', msg => {
            switch (msg.content) {
                case "yes":
                    message.delete()
                    message.channel.send(bEmbed)
                        .then(() => {
                            collector.stop('success')
                            process.exit()
                        }).catch(err => {
                            collector.stop('success')
                            if (err) return message.channel.send(err)
                        })
                    break
                case "no":
                    message.delete()
                    message.channel.send(cEmbed)
                    collector.stop('success')
                    break
            }
            collector.stop('success')
        })
        collector.on('end', (ignore, error) => {
            if (error && error !== 'success') {
                return message.channel.send(`Timed Out`)
                collector.stop('success')

            }
        })
    }

}