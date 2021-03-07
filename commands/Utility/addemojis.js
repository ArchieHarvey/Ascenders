const Discord = require('discord.js')

module.exports = {
    name: "addemojis",
    description: "Gives the overall emoji stats of a server based on server boosting.",
    usage: "addemojis",
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
        if (!message.guild.me.hasPermission('MANAGE_EMOJIS')) return archieembed('I need ` MANAGE EMOJIS ` permissions to continue.', message.channel)
        if (!message.member.hasPermission(`MANAGE_EMOJIS`)) {
            return archieembed(`You don't have the [Manage Emojis] permissions to use this command!`, message.channel)
        }
        
        const emojis = args.join(" ").match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/gi)
        if (!emojis) return message.channel.send(`**Please provide the emojis to add**`);
        const msg = await message.channel.send(`Please Wait!`);

        emojis.forEach(emote => {
            let emoji = Discord.Util.parseEmoji(emote);
            if (emoji.id) {
                const Link = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"
                    }`
                message.guild.emojis.create(
                    `${Link}`,
                    `${`${emoji.name}`}`
                ).then(em => {
                    msg.delete();
                    message.react('✅'); message.channel.send(`${em} Added with name \`${em.name}\``).catch(error => {
                        message.channel.send("An Error Occured. ")
                        console.log(error)
                    })

                })
            }
        })
    }
}