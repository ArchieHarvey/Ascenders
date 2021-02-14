const client = require('../ascenders')
const config = require('../config.json');
const prefix = config.prefix

client.on('ready', () => {
    console.log(`${client.user.username} ✅ has logged on`);

    const arrayofstatus = [
        //`${client.guilds.cache.size} servers`,
        //`${client.channels.cache.size} channels`,
        `with ${client.guilds.cache.reduce((c, g) => c + g.memberCount, 0)} users`,
        //`${client.user.tag} discord bot!`,
        //`run !help`
    ];

    let index = 0;
    setInterval(() => {
        if(index === arrayofstatus.length) index = 0;
        const status = arrayofstatus[index];
        client.user.setActivity(status);
        index++;
    }, 5000)
});