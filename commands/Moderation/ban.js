const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const archieembed = require("../../util/archieembed");

module.exports = {

    //Information about command
    name: "ban",
    description: "Bans the mentioned user from your server.",
    usage: "<@user> [reason]",
    enabled: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: ["BAN_MEMBERS"],
    botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {
        message.delete();

        const member = message.mentions.members.first()

        /*if (!message.member.hasPermission('BAN_MEMBERS'))
            return archieembed('You do not have permission to use this command.', message.channel)*/

        if (!member)
            return archieembed(`Invalid command usage, try using it like: \n \`${data.guild.prefix}ban [member] (optional reason)\` \n\n Arguments: \n \`member\`: *User mention (@User)* \n \`reason\`: *Text (may include spaces)*`, message.channel)
        if (member === message.member)
            return archieembed('You cannot ban yourself', message.channel)
        if (member.roles.highest.position >= message.member.roles.highest.position)
            return archieembed('You cannot ban someone with an equal or higher role than you.', message.channel)

        if (!member.bannable)
            return archieembed(`I am unable to ban the user`, message.channel)


        /*let reason = 'No reason specified';

        if (args.length > 1) reason = args.slice(1).join(' ');

        member.send(`🔨You were \`banned\` from **${message.guild.name}** \n**Reason**: ${reason}.`);
        member.ban({ reason: reason });

        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('User Banned')
            .setThumbnail(member.user.avatarURL())
            .addField('Username', member.user.username, true)
            .addField('Reason', reason, true)
            .addField('Banned by', message.author, true)
            .addField('User ID', member.id, true);



        message.channel.send(embed);*/

        let reason = args.slice(1).join(' ');
        if (!reason) reason = '`None`';
        if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

        await member.ban({ reason: reason });

        const embed = new MessageEmbed()
            .setTitle('Ban Member')
            .setDescription(`${member} was successfully banned.`)
            .addField('Moderator', message.member, true)
            .addField('Member', member, true)
            .addField('Reason', reason, true)
            .addField('User ID', member.id, true)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);
    }
};