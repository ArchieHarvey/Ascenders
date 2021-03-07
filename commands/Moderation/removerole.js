const { MessageEmbed } = require('discord.js');


module.exports = {
    name: "removerole",
    description: "Shows your text as Clyde\'s message",
    usage: "clyde <text>",
    enabled: true,
    aliases: ["roleremove", "roletake", "rolesremove", "role-remove", "roles-remove"],
    category: "Fun",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {

        const added = message.mentions.roles.first()
        const mentioned = message.mentions.members.first();

        if (!message.member.hasPermission('MANAGE_ROLES')) {
            const no = new MessageEmbed()
                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                .setDescription(`<a:error:815632261399445536> You dont have \`Manage Roles\` permission to execute this command!`)
                .setColor(`#131313`)
            message.channel.send(no)
        } else {
            if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
                const no2 = new MessageEmbed()
                    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                    .setDescription(`<a:error:  > I can not remove a role from someone without the \`Manage Roles\` permission!`)
                    .setColor(`#131313`)
                message.channel.send(no2)
            } else {
                if (!mentioned) {
                    const help = new MessageEmbed()
                        .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                        .setDescription(`<a:error:815632261399445536> Please mention remove to give a role from!`)
                        .setColor(`#131313`)
                    message.channel.send(help)
                } else {
                    if (!added) {
                        const pls = new MessageEmbed()
                            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                            .setDescription(`<a:error:815632261399445536> Please mention a valid role!`)
                            .setColor(`#131313`)
                        message.channel.send(pls)
                    } else {
                        const doesntHaveRole = mentioned._roles.includes(added.id);
                        if (!doesntHaveRole) {
                            const pls = new MessageEmbed()
                                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                                .setDescription(`<a:error:815632261399445536> User already does not have this role!`)
                                .setColor(`#131313`)
                            message.channel.send(pls)
                        } else {
                            if (message.member.roles.highest.position < added.position || message.member.roles.highest.position === added.position) {
                                const SCAMMER = new MessageEmbed()
                                    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                                    .setDescription(`<a:error:815632261399445536> This role is higher or equal to your highest role!`)
                                    .setColor(`#131313`)
                                message.channel.send(SCAMMER)
                            } else {
                                if (message.guild.me.roles.highest.position < added.position || message.guild.me.roles.highest.position === added.position) {
                                    const SCAMMER = new MessageEmbed()
                                        .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                                        .setDescription(`<a:error:815632261399445536> This role is higher or equal to my highest role!`)
                                        .setColor(`#131313`)
                                    message.channel.send(SCAMMER)
                                } else {
                                    mentioned.roles.remove(added)
                                    const done = new MessageEmbed()
                                        .setTitle('Success!')
                                        .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                                        .setDescription(`<a:success:815632261927141426> Removed ${added.name} role from ${mentioned}!`)
                                        .setFooter(`Requested by: ${message.author.username}`)
                                        .setColor(`#131313`)
                                    message.channel.send(done)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
