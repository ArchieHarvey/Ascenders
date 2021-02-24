const client = require('../ascenders')
const { Discord, MessageEmbed } = require('discord.js')
const db = require('../reconDB');

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.partial) await user.fetch();
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();
    if (user.bot) return;
    let emote = await db.get(`emoteid_${reaction.message.guild.id}_${reaction.emoji.id}`)
    if (!emote) return;
    let messageid = await db.get(`message_${reaction.message.guild.id}_${reaction.emoji.id}`)
    if (!messageid) return;
    let role = await db.get(`role_${reaction.message.guild.id}_${reaction.emoji.id}`)
    if (!role) return;

    if (reaction.message.id == messageid && reaction.emoji.id == `${emote}`) {
        reaction.message.guild.members.fetch(user).then(member => {
            let embed = new MessageEmbed()
                .setAuthor(user.username, user.displayAvatarURL())
                .setDescription(`**It's Looks You Already Have ${reaction.message.guild.roles.cache.get(role).name} Role** `)
                .setFooter(reaction.message.guild.name, reaction.message.guild.iconURL())
                .setTimestamp()
            if (member.roles.cache.has(role)) return user.send(embed)
            let sucsses = new MessageEmbed()
                .setAuthor(user.username, user.displayAvatarURL())
                .setDescription(`You have got the **${reaction.message.guild.roles.cache.get(role).name}** role by reacting in ${reaction.message.guild.name}`)
                .setFooter(reaction.message.guild.name, reaction.message.guild.iconURL())
                .setTimestamp()

            member.roles.add(role)
            return user.send(sucsses)
        })
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.partial) await user.fetch();
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();
    if (user.bot) return;
    let emote = await db.get(`emoteid_${reaction.message.guild.id}_${reaction.emoji.name}`)
    if (!emote) return;
    let messageid = await db.get(`message_${reaction.message.guild.id}_${reaction.emoji.name}`)
    if (!messageid) return;
    let role = await db.get(`role_${reaction.message.guild.id}_${reaction.emoji.name}`)
    if (!role) return;

    if (reaction.message.id == messageid && reaction.emoji.name == `${emote}`) {
        reaction.message.guild.members.fetch(user).then(member => {
            let embed = new MessageEmbed()
                .setAuthor(user.username, user.displayAvatarURL())
                .setDescription(`**It's Looks You Already Have ${reaction.message.guild.roles.cache.get(role).name} Role** `)
                .setFooter(reaction.message.guild.name, reaction.message.guild.iconURL())
                .setTimestamp()
            if (member.roles.cache.has(role)) return user.send(embed)
            let sucsses = new MessageEmbed()
                .setAuthor(user.username, user.displayAvatarURL())
                .setDescription(`You have got the **${reaction.message.guild.roles.cache.get(role).name}** role by reacting in ${reaction.message.guild.name}`)
                .setFooter(reaction.message.guild.name, reaction.message.guild.iconURL())
                .setTimestamp()

            member.roles.add(role)
            return user.send(sucsses)
        })
    }
})


client.on('messageReactionRemove', async (reaction, user) => {
    console.log(user.username)
    if (user.partial) await user.fetch();
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();
    if (user.bot) return;
    let emote = await db.get(`emoteid_${reaction.message.guild.id}_${reaction.emoji.id}`)
    if (!emote) return;
    let messageid = await db.get(`message_${reaction.message.guild.id}_${reaction.emoji.id}`)
    if (!messageid) return;
    let role = await db.get(`role_${reaction.message.guild.id}_${reaction.emoji.id}`)
    if (!role) return;
    if (reaction.message.id == messageid && reaction.emoji.id == `${emote}`) {
        reaction.message.guild.members.fetch(user).then(member => {

            let embed = new MessageEmbed()
                .setAuthor(user.username, user.displayAvatarURL())
                .setDescription(`**${reaction.message.guild.roles.cache.get(role).name}** Role Removed From You!`)
                .setFooter(reaction.message.guild.name, reaction.message.guild.iconURL())
                .setTimestamp()
            user.send(embed)
            member.roles.remove(role)

        })
    }
})

client.on('messageReactionRemove', async (reaction, user) => {
    console.log(user.username)
    if (user.partial) await user.fetch();
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();
    if (user.bot) return;
    let emote = await db.get(`emoteid_${reaction.message.guild.id}_${reaction.emoji.name}`)
    if (!emote) return;
    let messageid = await db.get(`message_${reaction.message.guild.id}_${reaction.emoji.name}`)
    if (!messageid) return;
    let role = await db.get(`role_${reaction.message.guild.id}_${reaction.emoji.name}`)
    if (!role) return;
    if (reaction.message.id == messageid && reaction.emoji.name == `${emote}`) {
        reaction.message.guild.members.fetch(user).then(member => {

            let embed = new MessageEmbed()
                .setAuthor(user.username, user.displayAvatarURL())
                .setDescription(`**${reaction.message.guild.roles.cache.get(role).name}** Role Removed From You!`)
                .setFooter(reaction.message.guild.name, reaction.message.guild.iconURL())
                .setTimestamp()
            user.send(embed)
            member.roles.remove(role)

        })
    }
})