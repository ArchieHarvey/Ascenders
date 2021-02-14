module.exports = {
    name: "lockdown",
  description: "Lock A Channel",
  usage: "",
  enabled: true,
  aliases: ['lockdown', 'locc', 'lockchannel'],
  category: "Moderation",
  memberPermissions: ['MANAGE_GUILD', 'MANAGE_CHANNELS'],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        if (args[0] === 'on') {
            const channel = message.channel;
            if (channel.permissionsFor(message.guild.id).has('SEND_MESSAGES') === false) {
                return message.channel.send({
                    embed: {
                        title: `${channel.name} | ${message.guild.name}`,
                        description: `${channel} Has Already Locked!`,
                        color: 'RED',
                        timestamp: new Date()
                    }
                })
            }

            channel.updateOverwrite(message.guild.id, {
                SEND_MESSAGES: false,
            });
            message.channel.send({
                embed: {
                    title: `Locked! | ${message.guild.name}`,
                    description: `${channel} Channel Has Been Locked By : ${message.author.tag}`,
                    color: 'RED',
                    timestamp: new Date()
                }
            })
        } else if (args[0] === 'off') {
            const channel = message.channel;

            if (channel.permissionsFor(message.guild.id).has('SEND_MESSAGES') === true) {
                return message.channel.send({
                    embed: {
                        title: `${channel.name} | ${message.guild.name}`,
                        description: `${channel} Is Not In Locked Condition.`,
                        color: 'GREEN',
                        timestamp: new Date()
                    }
                })
            }

            channel.updateOverwrite(message.guild.id, {
                SEND_MESSAGES: true,
            });
            message.channel.send({
                embed: {
                    title: 'Unlocked!',
                    description: `${channel} Has Been Unlocked By : ${message.author.tag}`,
                    color: 'GREEN',
                    timestamp: new Date()
                }
            })
        } else if (args[0] !== ['on', 'off']) {
            return message.channel.send({
                embed: {
                    title: `${message.author.username} | ${message.guild.name}`,
                    description: 'I Only Listen To `on` & `off`.',
                    color: 'RED',
                    timestamp: new Date()
                }
            })
        }
    }
}