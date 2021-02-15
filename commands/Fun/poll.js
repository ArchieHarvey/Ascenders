const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "poll",
    description: "Does a poll",
    usage: "poll [subject]",
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
        // eslint-disable-line no-unused-vars
        try {
            if (!args.join(" "))
                return message.channel.send({
                    embed: {
                        color: 3447003,
                        description: `Invalid command usage, try using it like: \n \`${data.guild.prefix}poll [subject]\` \n\n Arguments: \n \`subject\`: *Text (may include spaces)*`,
                        timestamp: new Date(),
                        footer: {
                            icon_url: client.user.displayAvatarURL(),
                            text: "© Ascenders 2020"
                        }
                    }
                });

            const embed = new MessageEmbed()
                .setAuthor(message.author.username + "'s poll:", message.author.displayAvatarURL())
                .setTitle(args.join(" "))
                .setDescription("React with the emojis to cast your vote!")
                .setColor("GREEN")
                .setTimestamp()
                .setFooter("© Ascenders 2021", client.user.displayAvatarURL())


            let msg = await message.channel.send(embed);

            await msg.react("<:upvote:803297221642420225");
            await msg.react("<:downvote:803297221948080218");
            await msg.react("<:ImposterGun:803168178405769227");
        } catch (err) {
            message.channel.send(client.errors + err).catch();
        }
    }
};