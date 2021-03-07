const { Client, Message, MessageEmbed } = require('discord.js');
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "announce",
    description: "To make an announcement",
    usage: "announce [channel] [message] {-ping}",
    enabled: true,
    aliases: [],
    category: "Utility",
    memberPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {


        if (!message.member.hasPermission('MANAGE_MESSAGES')) return archieembed('You do not have permission to use this command', message.channel)

        let mention;

        if (!args.length) return archieembed(`Invalid command usage, try using it like:\n\`${data.guild.prefix}announce [#channel] [message] (-ping)\`\n\n\`channel\`: **The channel you want to send the announcement**\n\`message:\` **The message you want to announce**\n\`-ping:\` **to ping everyone(optional)**`, message.channel)

        const channel = message.mentions.channels.first();
        if (!channel) return archieembed(`Invalid command usage, try using it like:\n\`${data.guild.prefix}announce [#channel] [message] (-ping)\`\n\n\`channel\`: **The channel you want to send the announcement**\n\`message:\` **The message you want to announce**\n\`-ping:\` **to ping everyone(optional)**`, message.channel)

        if (!args[1]) return archieembed(`Invalid command usage, try using it like:\n\`${data.guild.prefix}announce [#channel] [message] (-ping)\`\n\n\`channel\`: **The channel you want to send the announcement**\n\`message:\` **The message you want to announce**\n\`-ping:\` **to ping everyone(optional)**`, message.channel)

        // mentions
        if (args.some((val) => val.toLowerCase() === '-ping')) {
            for (let i = 0; i < args.length; i++) {
                if (args[i].toLowerCase() === '-ping') args.splice(i, 1);
            }

            mention = true;
        } else mention = false;

        if (mention === true) channel.send('@everyone');

        channel.send(
            new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(args.slice(1).join(" "))
                .setTimestamp()
                .setColor('RANDOM')
        )
    }
}