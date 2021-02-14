const { MessageEmbed } = require('discord.js');
const archieembed = require("../../util/archieembed");

module.exports = {

    //Information about command
    name: "kick",
    description: "Kicks the mentioned user from your server.",
    usage: "<@user> [reason]",
    enabled: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: ["KICK_MEMBERS"],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {
        message.delete();

        const member = message.mentions.members.first();


        if (!message.member.hasPermission('KICK_MEMBERS'))
            return archieembed('You do not have permission to use this command.', message.channel)

        if (!member)
            return archieembed(`Invalid command usage, try using it like: \n \`${data.guild.prefix}kick [member] (optional reason)\` \n\n Arguments: \n \`member\`: *User mention (@User)* \n \`reason\`: *Text (may include spaces)*`, message.channel)
        if (member === message.member)
            return archieembed('You cannot kick yourself', message.channel)

        if (member.roles.highest.position >= message.member.roles.highest.position)
            return archieembed('You cannot kick someone with a higher role than you.', message.channel)

        if (!member.kickable)
            return archieembed(`I am unable to kick the user`, message.channel)


        /*let reason = 'No reason specified';

        if (args.length > 1) reason = args.slice(1).join(' ');

        member.send({embed:{
                        color: "RANDOM",
                        author: {name: client.user.username, icon_url: client.user.displayAvatarURL()},
                        description: `👢You were \`kicked\` from **${message.guild.name}** \n**Reason**: ${reason}.`,
                        timestamp: new Date(),
                        footer: {icon_url: client.user.displayAvatarURL(), text: "© Ascenders 2020"}}})
        
                        member.kick(reason);
       
            const embed = new MessageEmbed()
                .setColor(15158332)
                .setTitle('User Kicked')
                .setThumbnail(member.user.avatarURL())
                .addField('Username', member.user.username, true)
                .addField('Reason', reason, true)
                .addField('Kicked by', message.author, true)
                .addField('User ID', member.id, true);
                
                

        message.channel.send(embed);*/
        let reason = args.slice(1).join(' ');
        if (!reason) reason = '`None`';
        if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

        await member.kick(reason);

        const embed = new MessageEmbed()
            .setTitle('Kick Member')
            .setDescription(`${member} was successfully kicked.`)
            .addField('Moderator', message.member, true)
            .addField('Member', member, true)
            .addField('Reason', reason)
            .addField('User ID', member.id, true)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);

    }
};