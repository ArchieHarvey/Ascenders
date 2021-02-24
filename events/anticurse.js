const client = require('../ascenders');
const words = require('../curse.json');
const db = require('../reconDB');

client.on('message', async(message) => {
    if(await db.has(`anticurse-${message.guild.id}`) === false) return;

    for (let i = 0; i < words.length; i++) {
        if(message.content.includes(words[i])) {
            message.delete();
            message.channel.send({embed: {
                color: "RANDOM",
                author: {
                            name: client.user.username,
                            icon_url: client.user.displayAvatarURL()
                          },
                description: "You cannot swear in this server. This server is protected by anti-curse feature.",
                timestamp: new Date(),
                footer: {
                              icon_url: client.user.displayAvatarURL(),
                              text: "© Ascenders 2021"
            }}
            })
                .then(m => m.delete({ timeout: 3000 }))
        }
    }
})