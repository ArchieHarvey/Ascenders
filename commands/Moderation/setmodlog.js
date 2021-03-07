const { Client, Message, MessageEmbed } = require("discord.js");
const archieembed = require("../../util/archieembed");
const { oneLine, stripIndent } = require('common-tags');
const Guild = require('../../database/Schematics/Guild'),
config = require("../../config.json");
module.exports = {

    //Information about command
    name: "setmodlog",
    description: "Changes nickname",
    usage: "<@user>",
    enabled: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: ["MANAGE_GUILD"],
    botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {
        const channel = await message.mentions.channels.first();

        if (!channel)
            return message.channel.send('I cannot find that channel. Please mention a channel within this server.').then(m => m.delete({timeout: 5000}));

            await Guild.findOne({
                id: message.guild.id
            }, async (err, guild) => {
                if (err) console.error(err);
                if (!guild) {
                    const newGuild = new Guild({
                        _id: mongoose.Types.ObjectId(),
                        id: message.guild.id,
                        guildName: message.guild.name,
                        prefix: config.prefix,
                        logChannelID: channel.id
                    });
    
                    await newGuild.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
    
                    return message.channel.send(`The mod logs channel has been set to ${channel}`);
                } else {
                    guild.updateOne({
                        logChannelID: channel.id
                    })
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
    
                    return message.channel.send(`The mod logs channel has been set to ${channel}`);
                };
            });
    }
}