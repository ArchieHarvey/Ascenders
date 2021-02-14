const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "give-role",
  description: "gives role",
  usage: "",
  enabled: false,
  aliases: ["giverole", "roleadd", "rolegive", "rolesadd", "role-add", "roles-add"],
  category: "Utility",
  memberPermissions: ['MANAGE_ROLES'],
  botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
  //Settings for command
  nsfw: false,
  ownerOnly: true,
  cooldown: 0,

    async execute(client, message, args, data){

        const added = message.mentions.roles.first()
        const mentioned = message.mentions.members.first();

        if(!message.member.hasPermission('MANAGE_ROLES')) {
            const no = new MessageEmbed()
            .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true})}`)
            .setDescription(`You dont have any permissions to execute this command!`)
            .setColor(`#131313`)
            message.channel.send(no)
        } else {
            if(!message.guild.me.hasPermission("MANAGE_ROLES")) {
                    const no2 = new MessageEmbed()
                    .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true})}`)
                    .setDescription(`I can not add a role to someone without the \`Manage Roles\` permission!`)
                    .setColor(`#131313`)
                    message.channel.send(no2)
            } else {
                if(!mentioned) {
                    const help = new MessageEmbed()
                    .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true})}`)
                    .setDescription(`Please mention someone to give a role to!`)
                    .setColor(`#131313`)
                    message.channel.send(help)
                } else {
                    if(!added) {
                        const pls = new MessageEmbed()
                        .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true})}`)
                        .setDescription(`Please mention a valid role!`)
                        .setColor(`#131313`)
                        message.channel.send(pls)
                    } else {
                        if(mentioned.roles.cache.has(`${added.id}`)) {
                            const pls = new MessageEmbed()
                        .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true})}`)
                        .setDescription(`User already has this role!`)
                        .setColor(`#131313`)
                        message.channel.send(pls)
                        } else {
                            if(message.member.roles.highest.position < added.position || message.member.roles.highest.position === added.position) {
                                const SCAMMER = new MessageEmbed()
                                .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true})}`)
                                .setDescription(`This role is higher or equal to your highest role!`)
                                .setColor(`#131313`)
                                message.channel.send(SCAMMER)
                                } else {
                                    if(message.guild.me.roles.highest.position < added.position || message.guild.me.roles.highest.position === added.position) {
                                        const SCAMMER = new MessageEmbed()
                                        .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true})}`)
                                        .setDescription(`This role is higher or equal to my highest role!`)
                                        .setColor(`#131313`)
                                        message.channel.send(SCAMMER)
                                        } else {
                                            mentioned.roles.add(added)
                                const done = new MessageEmbed()
                                .setTitle('Success!')
                                .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true})}`)
                                .setDescription(`Gave ${added.name} role to ${mentioned}!`)
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