const Discord = require('discord.js');
const { parse } = require("twemoji-parser");
const { MessageEmbed } = require("discord.js");
const archieembed = require("../../util/archieembed");

module.exports = {

    //Information about command
    name: "addemoji",
    description: "Adds a given Emoji to the server",
    usage: "[emoji]",
    enabled: true,
    aliases: ["stealemoji"],
    category: "Moderation",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {

        if (!message.guild.me.hasPermission('MANAGE_EMOJIS')) return archieembed('I need ` MANAGE EMOJIS ` permissions to continue.', message.channel)
        if (!message.member.hasPermission(`MANAGE_EMOJIS`)) {
            return archieembed(`You don't have the [Manage Emojis] permissions to use this command!`, message.channel)
        }

        const emoji = args[0];
        if (!emoji) return archieembed(`Please Give Me A Emoji!`, message.channel)

        let customemoji = Discord.Util.parseEmoji(emoji);
        if (customemoji.id) {
            const Link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${customemoji.animated ? "gif" : "png"
                }`;
            const name = args.slice(1).join(" ");
            try {
                const Added = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle(`Emoji Added`)
                    .setDescription(
                        `Emoji Has Been Added! | Name : ${name || `${customemoji.name}`} | Preview : [Click Me](${Link})`
                    );
                await message.guild.emojis.create(
                    `${Link}`,
                    `${name || `${customemoji.name}`}`
                )
                return message.channel.send(Added)
            } catch (err) {
                console.log(err)
                return archieembed(`An error has occured!\n\n**Possible Reasons:**\n\`\`\`- This server has reached the emojis limit\n- The bot doesn't have permissions.\n- The emojis size is too big.\`\`\``, message.channel)

            }
        } else {
            let CheckEmoji = parse(emoji, { assetType: "png" });
            if (!CheckEmoji[0])
                return archieembed(`**Please Give Me A Valid Emoji!**`, message.channel);
            message.channel.send(
                `**You Can Use Normal Emoji Without Adding In Server!**`
            );
        }

    }
}