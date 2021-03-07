const { MessageEmbed } = require('discord.js')


module.exports = {
    name: "emojistats",
    description: "Gives the overall emoji stats of a server based on server boosting.",
    usage: "emojistats",
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
        // Getting the total number of emotes depending.
        // The boost level of a server (which is the premium tier.)
        const serverPremiumTier = [
            100,
            200,
            300,
            500
        ]

        // Destructuring the guild object to the message parameter
        const { guild } = message

        // Value of maximum number of emotes depending on server's premium tier.
        // ex. Tier 1 --> 200 emotes slot available
        // Tier 3 --> 500 emotes slot available 
        const emojiListBasedOnPremiumTier = serverPremiumTier[guild.premiumTier]

        // --------------------------------------------------------------------------------------------------------------------------------------------------
        const amountOfStaticEmojis = guild.emojis.cache.filter(emoji => !emoji.animated).size
        const maximumAmountOfStaticEmojis = emojiListBasedOnPremiumTier / 2
        const leftStaticEmojis = `${emojiListBasedOnPremiumTier / 2 - guild.emojis.cache.filter(emoji => !emoji.animated).size} left`
        const staticEmojiPercentage = `${((guild.emojis.cache.filter(emoji => !emoji.animated).size / (emojiListBasedOnPremiumTier / 2)) * 100).toFixed(2)}%`

        const amountOfAnimatedEmojis = guild.emojis.cache.filter(emoji => emoji.animated).size
        const maximumAmountOfAnimatedEmojis = emojiListBasedOnPremiumTier / 2
        const leftAnimatedEmojis = `${emojiListBasedOnPremiumTier / 2 - guild.emojis.cache.filter(emoji => emoji.animated).size} left`
        const animatedEmojiPercentage = `${((guild.emojis.cache.filter(emoji => emoji.animated).size / (emojiListBasedOnPremiumTier / 2)) * 100).toFixed(2)}%`

        const amountOfTotalEmojis = guild.emojis.cache.size
        const maximumAmountOfTotalEmojis = emojiListBasedOnPremiumTier
        const leftTotalEmojis = `${emojiListBasedOnPremiumTier - guild.emojis.cache.size} left`
        const totalEmojiPercentage = `${((guild.emojis.cache.size / emojiListBasedOnPremiumTier) * 100).toFixed(2)}%`
        // ---------------------------------------------------------------------------------------------------------------------------------------------------

        const staticEmojisBasedOnPremiumTier = `${amountOfStaticEmojis} / ${maximumAmountOfStaticEmojis} | ${leftStaticEmojis} ${staticEmojiPercentage}`
        const animatedEmojisBasedOnPremiumTier = `${amountOfAnimatedEmojis} / ${maximumAmountOfAnimatedEmojis} | ${leftAnimatedEmojis} ${animatedEmojiPercentage}`
        const totalEmojisBasedOnPremiumTier = `${amountOfTotalEmojis} / ${maximumAmountOfTotalEmojis} | ${leftTotalEmojis} ${totalEmojiPercentage}`

        const emojiStatsEmbed = new MessageEmbed()
            .setTitle(`${message.guild.name}\'s Emoji stats`)
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096, }))
            .addField("Normal Emotes", staticEmojisBasedOnPremiumTier, true)
            .addField("Animated Emotes", animatedEmojisBasedOnPremiumTier, true)
            .addField("Total Emotes", totalEmojisBasedOnPremiumTier, true)
            .setTimestamp()


        message.channel.send({
            embed: emojiStatsEmbed
        })
    }
}