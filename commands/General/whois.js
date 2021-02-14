const { MessageEmbed } = require("discord.js"),
moment = require('moment');

module.exports = {
    //Command Information
    name: "userinfo",
    description: "Get information about a user",
    usage: "userinfo",
    enabled: true,
    aliases: ["whois"],
    category: "General",
    memberPermissions: [],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let status;
        switch (user.presence.status) {
            case "online":
                status = "🟢 Online";
                break;
            case "dnd":
                status = "🔴 DND";
                break;
            case "idle":
                status = "🌙 Idle";
                break;
            case "offline":
                status = "⚪ Offline";
                break;
        }

      var permissions = [];
    var acknowledgements = 'None';
   
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        
    if(member.hasPermission("KICK_MEMBERS")){permissions.push("Kick Members");}
    if(member.hasPermission("BAN_MEMBERS")){permissions.push("Ban Members");}
    if(member.hasPermission("ADMINISTRATOR")){permissions.push("Administrator");}
    if(member.hasPermission("MANAGE_MESSAGES")){permissions.push("Manage Messages");}
    if(member.hasPermission("MANAGE_CHANNELS")){permissions.push("Manage Channels");}
    if(member.hasPermission("MENTION_EVERYONE")){permissions.push("Mention Everyone");}
    if(member.hasPermission("MANAGE_NICKNAMES")){permissions.push("Manage Nicknames");}
    if(member.hasPermission("MANAGE_ROLES")){permissions.push("Manage Roles");}
    if(member.hasPermission("MANAGE_WEBHOOKS")){permissions.push("Manage Webhooks");}
    if(member.hasPermission("MANAGE_EMOJIS")){permissions.push("Manage Emojis");}
    if(permissions.length == 0){permissions.push("No Key Permissions Found");}
    if(member.user.id == message.guild.ownerID){acknowledgements = 'Server Owner';}
      
    var playing = ("[ " + user.presence.activities + " ]")

        const embed = new MessageEmbed()
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        
        .setTitle(`User Info Command for ${user.user.username}`)
        .setThumbnail(member.user.displayAvatarURL())
        .addFields({name: "Name: ",value: user.user.username,inline: true},
                {name: "#️⃣ Discriminator: ",value: `#${user.user.discriminator}`,inline: true},
                {name: "🆔 ID: ",value: user.user.id,inline: true},
                {name: 'Avatar link: ',value: `[Click Here](${user.user.displayAvatarURL()})`,inline: true})
        .setColor('RANDOM')
        .addField("Playing", playing, true)
        .addField("Status", `${status}`, true)
        .addField('Joined at: ',`${moment(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss")}`, true)
        .addField("Created at: ",`${moment.utc(member.user.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss")}`, true)
        .addField('Highest role', member.roles.highest, true)
        .addField('All roles', member.roles.cache.map(r => `${r}`).join(' | '), true)
        .addField("Acknowledgements: ", `${acknowledgements}`, true)
        .addField("Permissions: ", `${permissions.join(', ')}`)
        .addField(`**Nickname (If Applicable):**`, `${member.nickname || `**Cannot Find A Nickname For This User**`}`)
        .setTimestamp()
        .setFooter("© Ascenders 2020", client.user.displayAvatarURL())
          
        await message.channel.send(embed)   
    },
};
