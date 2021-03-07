const { MessageAttachment } = require('discord.js')
const Levels = require('discord-xp')
const canvacord = require('canvacord')
const db = require('../../reconDB');
const archieembed = require("../../util/archieembed")

module.exports = {

    //Information about command
    name: "rank",
    description: "Adds a given Emoji to the server",
    usage: "[emoji]",
    enabled: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {
        const check = await db.has(`leveling-${message.guild.id}`);
        if (check === false) return archieembed(`**Leveling is disabled!**\n\nTo enable it use \`${data.guild.prefix}leveling enable\``, message.channel);
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        const user = await Levels.fetch(target.id, message.guild.id)

        if (!user) return message.channel.send("User does not have XP")
        try {
            message.channel.startTyping()

            //const neededXp = Levels.xpFor(parseInt(user.level) + 1);
            const neededXp = Levels.xpFor((user.level) + 1)

            const wallpapers = [
                `http://images.unsplash.com/photo-1511447333015-45b65e60f6d5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max`,
                `https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500`,
                `https://wallpapercave.com/wp/wp2646303.jpg`,
                `https://www.itl.cat/pngfile/big/0-9910_cool-desktop-wallpapers-red-nature.jpg`,
                `https://2.bp.blogspot.com/-84f3eq8Zv3U/WAwjFLsu38I/AAAAAAAAM34/yGrYAcNXRZE1i8KeMELxfnmXrYqjnLx9wCLcB/s1600/Pretty%2Bnature%2BBackgrounds%2B3.jpg`,
                `https://cdn.pling.com/img/4/3/6/f/9d31bafb8d33869275b11364e9709074de4a.png`,
                `https://2.bp.blogspot.com/-4jLRQiNoaNY/WAwknqSnq3I/AAAAAAAAM74/L90KOSpIgdUAdXHHKhqGj36bVFV1mEtMwCLcB/s1600/Pretty%2Bnature%2BBackgrounds%2B7.jpg`,
                `https://4.bp.blogspot.com/-cwmz4kbDFbc/WAwkoVww2sI/AAAAAAAAM78/JH5QHBtRqOYisJMU5j5ELMvZfRF7XIx_QCLcB/s1600/Pretty%2Bnature%2BBackgrounds%2B9.jpg`


            ];

          
            const response = wallpapers[Math.floor(Math.random() * wallpapers.length)];
            const card = new canvacord.Rank()
                .setAvatar(target.user.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setCurrentXP(user.xp)
                .setLevel(user.level)
                .setRank(1, "RANK", false)
                .setBackground("IMAGE", response)
                .setRequiredXP(neededXp)
                .setStatus(target.presence.status)
                .setProgressBar("#FFA500", "COLOR")
                .setUsername(target.user.username)
                .setDiscriminator(target.user.discriminator)

            let img = await card.build()

            return message.channel.send(new MessageAttachment(img, 'xp.png'))
        } catch {
            message.channel.send('Oops something happened!')
        } finally {
            message.channel.stopTyping()
        }
    }
}