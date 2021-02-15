const { MessageEmbed } = require("discord.js");
const archieembed = require("../../util/archieembed");

module.exports = {
    name: "say",
    description: "repeats you",
    usage: "say",
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
        if (!args[0]) return archieembed('Please provide a message for me to say', message.channel);

        const msg = message.content.slice(message.content.indexOf(args[0]), message.content.length);
        message.channel.send(msg, { disableMentions: 'everyone' });
    }
};
