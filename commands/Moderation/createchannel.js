const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const archieembed = require("../../util/archieembed");
const Guild = require('../../database/Schematics/Guild'),

    config = require("../../config.json");

module.exports = {

    //Information about command
    name: "createchannel",
    description: "Bans the mentioned user from your server.",
    usage: "<@user> [reason]",
    enabled: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: ["MANAGE_CHANNELS"],
    botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {
        const channelNameQuery = args.join(" ")
        if (!channelNameQuery) return message.reply('enter channel name!')
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

        message.guild.channels.create(channelNameQuery)
            .then(ch => {
                message.channel.send(`click ${ch} to access the newly created channel`)
            })

        if (!logChannel) {
            return
        } else {
            const embed = new MessageEmbed()
                .setColor(15158332)
                .setTitle('Text channel created')
                .addField('Channel Name', `${channelNameQuery}`, true)
                .addField('Created by', `${message.author}`, true)
                .setTimestamp()
                .setThumbnail(client.user.avatarURL())

            return logChannel.send(embed);
        };
    }
}