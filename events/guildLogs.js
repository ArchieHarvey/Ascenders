const client = require('../ascenders')
const { MessageEmbed } = require('discord.js')
const logsChannel = '807998842120699954'

client.on("guildCreate", (guild) => {
    client.channels.cache.get(logsChannel).send(
        new MessageEmbed()
            .setTitle('Joined a Server')
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addField('GUILD INFO', `${guild.name} (${guild.id}) **${guild.memberCount} members!**`)
            .addField('OWNER INFO', `${guild.owner} (${guild.owner.id})`)
            .setFooter(`Currently in ${client.guilds.cache.size} guilds serving ${client.guilds.cache.reduce((c, g) => c + g.memberCount, 0)} users`)
            .setTimestamp()
            .setColor('GREEN')
    )
});

client.on("guildDelete", (guild) => {
    client.channels.cache.get(logsChannel).send(
        new MessageEmbed()
            .setTitle('Left a Server')
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addField('GUILD INFO', `${guild.name} (${guild.id}) **${guild.memberCount} members!**`)
            .addField('OWNER INFO', `${guild.owner} (${guild.owner.id})`)
            .setFooter(`Currently in ${client.guilds.cache.size} guilds serving ${client.guilds.cache.reduce((c, g) => c + g.memberCount, 0)} users`)
            .setTimestamp()
            .setColor('RED')
    )
})