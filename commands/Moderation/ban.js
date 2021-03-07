const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const archieembed = require("../../util/archieembed");
const User = require('../../database/Schematics/User');
const Guild = require('../../database/Schematics/Guild'),

    config = require("../../config.json");

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

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        const guildDB = await Guild.findOne({
            id: message.guild.id
        }, async (err, guild) => {
            if (err) console.error(err);

            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    id: message.guild.id,
                    guildName: message.guild.name,
                    prefix: config.prefix,
                    logChannelID: null
                });

                await newGuild.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
            };
        });

        const logChannel = message.guild.channels.cache.get(guildDB.logChannelID);
        /*if (!message.member.hasPermission('BAN_MEMBERS'))
            return archieembed('You do not have permission to use this command.', message.channel)*/

        if (!member)
            return archieembed(`Invalid command usage, try using it like: \n \`${data.guild.prefix}ban [member] (optional reason)\` \n\n Arguments: \n \`member\`: *User mention (@User)* \n \`reason\`: *Text (may include spaces)*`, message.channel)
        if (member === message.member)
            return archieembed('You cannot ban yourself', message.channel)
        if (member.user.id === message.guild.ownerID)
            return archieembed(`You can\'t ban the owner of the server!`, message.channel)
        if (member.roles.highest.position >= message.member.roles.highest.position)
            return archieembed('You cannot ban someone with an equal or higher role than you.', message.channel)

        if (!member.bannable)
            return archieembed(`I am unable to ban the user`, message.channel)

        User.findOne({
            id: message.guild.id,
            userID: member.id
        }, async (err, user) => {
            if (err) console.error(err);

            if (!user) {
                const newUser = new User({
                    _id: mongoose.Types.ObjectId(),
                    id: message.guild.id,
                    userID: member.id,
                    muteCount: 0,
                    warnCount: 0,
                    kickCount: 1,
                    banCount: 0
                });

                await newUser.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
            } else {
                user.updateOne({
                    banCount: user.banCount + 1
                })
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
            };
        });

        let reason = args.slice(1).join(' ');
        if (!reason) reason = '`None`';
        if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

        member.ban({ reason: reason });
        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle('User Banned')
            .setThumbnail(member.user.avatarURL())
            //.setImage(`https://tenor.com/view/ban-banned-gif-8540509`)
            .addField('Username', member.user.username)
            .addField('User ID', member.id)
            .addField('Banned by', message.author)
            .addField('Reason', reason);

        message.channel.send(embed)

        if (!logChannel) {
            return
        } else {
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('User Banned')
                .setThumbnail(member.user.avatarURL())
                .addField('Username', member.user.username)
                .addField('User ID', member.id)
                .addField('Banned by', message.author)
                .addField('Reason', reason);

            return logChannel.send(embed);
        }
    }
};