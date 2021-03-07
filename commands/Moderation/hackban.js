const { MessageEmbed } = require('discord.js');
const archieembed = require("../../util/archieembed");

module.exports = {

    //Information about command
    name: "hackban",
    description: "Kicks the mentioned user from your server.",
    usage: "<@user> [reason]",
    enabled: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: ["BAN_MEMBERS"],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS, BAN_MEMBERS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {


        if (!message.member.hasPermission('BAN_MEMBERS'))
            return archieembed('You do not have permission to use this command.', message.channel)

        
        let userID = args[0];
        let reason = args.slice(1).join(' ');
        if (!reason) reason = '`None`';
        if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

        if (!userID) return archieembed("Please provide a valid user ID", message.channel);
        if (isNaN(userID)) return archieembed("User ID should be a number", message.channel);
        if (userID === message.author.id) return archieembed("You cannot ban yourself", message.channel);
        if (userID === client.user.id) return archieembed("You cant ban me. why?", message.channel);

        client.users.fetch(userID).then(async user => {
            await message.guild.members.ban(user.id, { reason: reason });
            const embed = new MessageEmbed()
                .setTitle('Ban Member')
                .setDescription(`${user.id} was successfully banned from outside the server.`)
                .addField('Moderator', message.member, true)
                .addField('Member', userID, true)
                .addField('Reason', reason, true)
                .addField('User ID', user.tag, true)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor(message.guild.me.displayHexColor);
            message.channel.send(embed);
        }).catch(error => {
            return archieembed(`An error occurred: **${error}**`, message.channel);
        })

    }
};