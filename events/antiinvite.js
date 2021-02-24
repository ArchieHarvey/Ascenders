const { guilds } = require('../ascenders.js');
const client = require('../ascenders.js')
const db = require('../reconDB');




client.on('message', async (message) => {
    if(await db.has(`antiinvite-${message.guild.id}`) === false) return;
    const isInvite = async (guild, code) => {
        return await new Promise((resolve) => {
            guild.fetchInvites().then((invites) => {
                for (const invite of invites) {
                    if (code === invite[0]) {
                        resolve(true)
                        return
                    }
                    console.log("INVITES:", invite[0] )
                }
                 resolve(false)
            })
        })

    }

    const { guild, member, content } = message

    const code = content.split('discord.gg/')[1]

    if (content.includes(`discord.gg/`)) {
        const isOurInvite = await isInvite(guild, code)
        if(!isOurInvite) {
            message.delete();
            message.channel.send({embed: {
                color: "RANDOM",
                author: {
                            name: member.user.username,
                            icon_url: member.user.displayAvatarURL()
                          },
                description: `<@${member.user.id}> You cannot advertise your discord server. This server is protected by anti-invite system.`,
                timestamp: new Date(),
                footer: {
                              icon_url: client.user.displayAvatarURL(),
                              text: "© Ascenders 2021"
            }}
            })
        }
    }
}
)