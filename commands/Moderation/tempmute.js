const {Message, MessageEmbed}= require('discord.js')
const ms = require('ms')
const archieembed = require("../../util/archieembed")

module.exports = {

    //Information about command
    name: "tempmute",
    description: "Temporarily mutes the mentioned user",
    usage: "[name]",
    enabled: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: ["ADMINISTRATOR"],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,
  
    //Execute to command once the settings have been checked
    async execute(client, message, args, data){
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return archieembed('You do not have permissions to use this command', message.channel)
        const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const time = args[1]
        if(!Member) return archieembed('Member is not found.', message.channel)
        if(!time) return archieembed('Please specify a time.', message.channel)
        const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'muted')
        if(!role) {
            try {
                archieembed('Muted role is not found, attempting to create muted role.', message.channel)

                let muterole = await message.guild.roles.create({
                    data : {
                        name : 'muted',
                        permissions: []
                    }
                });
                message.guild.channels.cache.filter(c => c.type === 'text').forEach(async (channel, id) => {
                    await channel.createOverwrite(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    })
                });
                archieembed('Muted role has sucessfully been created.', message.channel)
            } catch (error) {
                console.log(error)
            }
        };
        let role2 = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted')
        if(Member.roles.cache.has(role2.id)) return archieembed(`${Member.displayName} has already been muted.`, message.channel)
        await Member.roles.add(role2)
        archieembed(`${Member.displayName} is now muted.`, message.channel)

        setTimeout(async () => {
            await Member.roles.remove(role2)
            archieembed(`${Member.displayName} is now unmuted`, message.channel)
        }, ms(time))
    }
}