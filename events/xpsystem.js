const client = require('../ascenders')
const config = require("./../config.json")
const db = require('../reconDB');
const Levels = require('discord-xp')

Levels.setURL(config.mongoDB)


client.on('message', async message => {
    if (await db.has(`leveling-${message.guild.id}`) === false) return;
    if (!message.guild) return;
    if (message.author.bot) return


    const randomXp = Math.floor(Math.random() * 9) + 1;
    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);
    if (hasLeveledUp) {
        const user = await Levels.fetch(message.author.id, message.guild.id)
        message.reply(`You have leveled up to level ${user.level}!`);

    }
})