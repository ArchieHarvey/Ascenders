const client = require('../ascenders')
const config = require('../config.json');
const prefix = config.prefix
const { MessageEmbed } = require('discord.js')
client.on('ready', () => {
    console.log(`${client.user.username} ✅ has logged on`);

     let index = 0;
    setInterval(() => {
        //client.user.setActivity(`Ascender Music`, { type: 'PLAYING' })
        //client.user.setActivity(`${client.guilds.cache.size} Servers`, { type: 'COMPETING' })
       // client.user.setActivity(`with ${client.guilds.cache.reduce((c, g) => c + g.memberCount, 0)} users`, { type: 'PLAYING' })
        //client.user.setActivity(`RAM: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`, { type: 'PLAYING' })
       // client.user.setActivity(`since ${Math.floor(process.uptime() / 60)} minutes`, { type: 'PLAYING' })
        //client.user.setActivity(`Heap Total: ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`, { type: 'PLAYING' })
        const arrayofstatus = [
            `with ${client.guilds.cache.reduce((c, g) => c + g.memberCount, 0)} users`,
            `since ${Math.floor(process.uptime() / 60)} minutes`,
            `in ${client.guilds.cache.size} Servers`,
            `Ascender Music`,
            `with ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB RAM`
            ]
            
            if (index === arrayofstatus.length) index = 0;
        const status = arrayofstatus[index];
        client.user.setActivity(status, {type: "PLAYING"});
        index++;
    }, 60000)


  /*  const upchannel = client.channels.cache.get('810530165331066942')
    const upembed = new MessageEmbed()
        .setThumbnail(client.user.avatarURL())
        .setTitle("Bot Online")
        .setDescription("Hey I am back online")
    upchannel.send(upembed)*/
});