const { tictactoe } = require("reconlx");

module.exports = {
    name: "tictactoe",
    description: "tictactoe with a friend",
    usage: "tictactoe",
    enabled: true,
    aliases: [],
    category: "Fun",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        const member = message.mentions.members.first();
        if (!member)
            return message.channel.send({
                embed: {
                    color: "RANDOM",
                    description: `Invalid command usage, try using it like: \n \`${data.guild.prefix}tictactoe [user]\` \n\n Arguments: \n \`user\`: *tag user*`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.displayAvatarURL(),
                        text: `© Ascenders 2021`
                    }
                }
            });

        new tictactoe({
            player_two: member,
            message: message
        });
    }
};
