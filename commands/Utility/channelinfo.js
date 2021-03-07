const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "channelinfo",
    description: "Checks if autorole is set or not",
    usage: "autorole",
    enabled: true,
    aliases: [],
    category: "Utility",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        let channel = message.mentions.channels.first() || client.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.channel;
        if (!channel) return message.channel.send("**Channel Not Found!**");

        let channelembed = new MessageEmbed()
            .setTitle(`Channel Information for ${channel.name}`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField("**NSFW**", channel.nsfw, true)
            .addField("**Channel ID**", channel.id, true)
            .addField("**Channel Type**", channel.type)
            .addField("**Channel Description**", `${channel.topic || "No Description"}`)
            .addField("**Channel Created At**", channel.createdAt)
            .setColor("GREY")
            .setFooter(`© Ascenders ${new Date().getFullYear()}`)
        message.channel.send(channelembed);
    }
}