const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const archieembed = require('../../util/archieembed')
module.exports = {

    //Information about command
    name: "binary",
    description: "converts to binary",
    usage: "binary <>",
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
        if (!args[0]) return archieembed(`Unknown paramenter. please choose whether to encode or decode! \n\nInvalid command usage, try using it like: \n\`${data.guild.prefix}binary <encode/decode> [argument]\`\n\n\`arguments\`: The argument you want to convert`, message.channel)

        let choice = ["encode", "decode"];
        if (!choice.includes(args[0].toLowerCase())) return archieembed(`Unknown paramenter. please choose whether to encode or decode! \n\nInvalid command usage, try using it like: \n\`${data.guild.prefix}binary <encode/decode> [argument]\`\n\n\`arguments\`: The argument you want to convert`, message.channel)

        let text = args.slice(1).join(" ");

        if (!text) return archieembed(`Input is missing! \n\nInvalid command usage, try using it like: \n\`${data.guild.prefix}binary <encode/decode> [argument]\`\n\n\`arguments\`: The argument you want to convert`, message.channel)

        if (text.length >= 1024) return archieembed(`**Maximum characters supported is 1024 characters due to Discord API restrictions.**`, message.channel)

        function encode(char) {
            return char.split("").map(str => {
                const converted = str.charCodeAt(0).toString(2);
                return converted.padStart(8, "0");
            }).join(" ")
        }

        function decode(char) {
            return char.split(" ").map(str => String.fromCharCode(Number.parseInt(str, 2))).join("")
        }

        if (args[0].toLowerCase() === "encode") {
            return message.channel.send({
                embed: {
                    color: "RANDOM",
                    description: encode(text),
                    title: "Encode",
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.displayAvatarURL(),
                        text: "© Ascenders 2021"
                    }
                }
            });
        } else if (args[0].toLowerCase() === "decode") {
            return message.channel.send({
                embed: {
                    color: "RANDOM",
                    description: decode(text),
                    title: "Decode",
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.displayAvatarURL(),
                        text: "© Ascenders 2021"
                    }
                }
            });
        }
    }
}