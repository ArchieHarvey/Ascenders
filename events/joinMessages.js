const client = require('../ascenders')

client.on('guildCreate', (guild) => {
    
            
    var found = false;
    guild.channels.cache.forEach(function(channel, id) {
        if(found == true || channel.type != "text") {
          return;
        }
        
        if(guild.me.permissionsIn(channel).has("SEND_MESSAGES") && guild.me.permissionsIn(channel).has("VIEW_CHANNEL")) {
            found = true;
            return channel.send({embed: {
                author: {
                    name: client.user.username,
                    icon_url: client.user.displayAvatarURL({size: 4096, dynamic: true}),
                    //url: 'https://nekoyasui.ga'
                },
                description: `Thank you for inviting to your server :white_check_mark: \n\nMy global default prefix is \`!\` or you can just mention me.\n\nYou can see a list of commands by typing <@!${client.user.id}>help\nYou can change my prefix with <@!${client.user.id}>setprefix\n\n If you need help, feel free to join our support server at https://discord.gg/DuTW8zp3`,
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: '© Github.com/ArchieHarvey'
                }
            }});
        }
    })
});
