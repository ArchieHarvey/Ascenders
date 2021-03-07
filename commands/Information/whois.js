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
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {







        var permissions = [];
        var acknowledgements = 'None';

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        let status;
        switch (member.presence.status) {
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

        let clientStatus;
        switch (member.presence.clientStatus) {
            case "web":
                status = "web";
                break;
            case "mobile":
                status = "mobile";
                break;
            case "desktop":
                status = "desktop";
                break;
        }

        if (member.hasPermission("KICK_MEMBERS")) { permissions.push("Kick Members"); }
        if (member.hasPermission("BAN_MEMBERS")) { permissions.push("Ban Members"); }
        if (member.hasPermission("ADMINISTRATOR")) { permissions.push("Administrator"); }
        if (member.hasPermission("MANAGE_MESSAGES")) { permissions.push("Manage Messages"); }
        if (member.hasPermission("MANAGE_CHANNELS")) { permissions.push("Manage Channels"); }
        if (member.hasPermission("MENTION_EVERYONE")) { permissions.push("Mention Everyone"); }
        if (member.hasPermission("MANAGE_NICKNAMES")) { permissions.push("Manage Nicknames"); }
        if (member.hasPermission("MANAGE_ROLES")) { permissions.push("Manage Roles"); }
        if (member.hasPermission("MANAGE_WEBHOOKS")) { permissions.push("Manage Webhooks"); }
        if (member.hasPermission("MANAGE_EMOJIS")) { permissions.push("Manage Emojis"); }
        if (permissions.length == 0) { permissions.push("No Key Permissions Found"); }
        if (member.user.id == message.guild.ownerID) { acknowledgements = 'Server Owner'; }

        const created = Math.floor(
            (new Date() - member.user.createdAt) / (1000 * 60 * 60 * 24)
        );

        const joined = Math.floor(
            (new Date() - member.joinedAt) / (1000 * 60 * 60 * 24)
        );

        const embed = new MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL())

            .setTitle(`User Info Command for ${member.user.username}`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor('RANDOM')
            .addField("User Info", [
                `Username: ${member.user.username}`,
                `#️⃣ Discriminator: #${member.user.discriminator}`,
                `🆔 ID: ${member.user.id}`,
                `Avatar Link: [Click Here](${member.user.displayAvatarURL({ dynamic: true })})`,
                `**Created at:** ${moment.utc(member.user.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss")} **(${created} days ago)**`,
                

            ])
            .addField("User Presence", [
                `Status: ${status}`,
                `Playing: ${member.presence.activities[0] ? member.presence.activities[0].name : `**User isn't playing a game!**`}`,
                `Devices: ${member.presence.status === "offline" ? "None" : Object.keys(member.presence.clientStatus).join(", ")}`,
            ])
            .addField("Server Member Info", [
                `**Joined on:** ${moment(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss")} **(${joined} days ago)**`,
                `**Acknowledgements:** ${acknowledgements}`,
                `**Nickname:** ${member.nickname || `**Cannot Find A Nickname For This User**`}`,
                `**Permissions:** ${permissions.join(', ')}`,
                `**Highest role:** ${member.roles.highest}`,
                `**All roles:** ${member.roles.cache.map(r => `${r}`).join(' | ')}`
                
            ])
            .setTimestamp()
            .setFooter(`© Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())

        await message.channel.send(embed)
    },
};
