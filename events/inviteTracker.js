const client = require('../ascenders.js');

const { promisify } = require('util');

const wait = promisify(setTimeout);

let invites;

const id = '628656463879077900';

client.on('ready', async() => {
    await wait(2000);

    client.guilds.cache.get(id).fetchInvites().then(inv => {
        invites = inv;
    })
})

client.on('guildMemberAdd', async(member) => {
    if(member.guild.id !== id) return;

    member.guild.fetchInvites().then(gInvites => {
        const invite = gInvites.find((inv) => invites.get(inv.code).uses < inv.uses);

        const channel = member.guild.channels.cache.get('810950001118806066');

        channel.send({embed: {
            color: "RANDOM",
            description: `${member} was invited by ${invite.inviter} and the code was ${invite.code}`,
            timestamp: new Date()
        }
        })
    })
})