const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "poll",
    description: "Does a poll",
    usage: "poll [subject]",
    enabled: true,
    aliases: [],
    category: "Fun",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        // eslint-disable-line no-unused-vars
        try {
            if (!args.join(" "))
                return message.channel.send({
                    embed: {
                        color: 3447003,
                        description: `Invalid command usage, try using it like: \n \`${data.guild.prefix}poll [subject]\` \n\n Arguments: \n \`subject\`: *Text (may include spaces)*`,
                        timestamp: new Date(),
                        footer: {
                            icon_url: message.author.displayAvatarURL({ dynamic: true }),
                            text: message.author.tag
                        }
                    }
                });

            const embed = new MessageEmbed()
                .setAuthor(message.author.username + "'s poll:", message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(args.join(" "))
                .setDescription("React with the emojis to cast your vote!")
                .setColor("GREEN")
                .setTimestamp()
                .setFooter("Poll started by "+message.author.tag, message.author.displayAvatarURL({ dynamic: true }))


            let msg = await message.channel.send(embed);

            await msg.react("<:upvote:814162166244048967");
            await msg.react("<:downvote:814162166361227264");
            await msg.react("<:imposter:814163531027972097");
            
        } catch (err) {
            message.channel.send(client.errors + err).catch();
        }
    }
};