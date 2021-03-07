const { tictactoe } = require("reconlx");
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "tictactoe",
    description: "tictactoe with a friend",
    usage: "tictactoe",
    enabled: true,
    aliases: [],
    category: "Fun",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        const member = message.mentions.members.first();

        const invalid = new MessageEmbed()
            .setColor('RED')
            .setDescription(`Invalid command usage, try using it like: \n \`${data.guild.prefix}tictactoe [user]\` \n\n Arguments: \n \`user\`: *tag user*`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!member) return message.channel.send(invalid)

        new tictactoe({
            player_two: member,
            message: message
        });
    }
};
