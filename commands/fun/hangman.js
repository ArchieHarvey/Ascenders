const { hangman } = require('reconlx')
const archieembed = require('../../util/archieembed')
module.exports = {

    //Information about command
    name: "hangman",
    description: "hangman game",
    usage: "hangman <#channel> <text>",
    enabled: true,
    aliases: [],
    category: "Fun",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {
        //if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send('You need manage messages permission.')
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if (!channel) return archieembed(`**Please specify the channel you want to play the game in!**\n\nInvalid command usage, try using it like: \n \`${data.guild.prefix}hangman [channel] [word]\` \n\n Arguments: \n \`channel\`: *The text channel*\n \`word\`: *The word*`, message.channel)
        const word = args.slice(1).join(" ")
        if (!word) return archieembed(`**You forgot to give the word!** \n\nInvalid command usage, try using it like: \n \`${data.guild.prefix}hangman [channel] [word]\` \n\n Arguments: \n \`channel\`: *The text channel*\n \`word\`: *The word*`, message.channel)

        const hang = new hangman({
            message: message,
            word: word,
            client: client,
            channelID: channel.id
        })

        hang.start();
    }
}