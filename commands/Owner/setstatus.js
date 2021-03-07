const { MessageEmbed } = require('discord.js');
const archieembed = require("../../util/archieembed")
const config = require('../../config.json')

module.exports = {
    name: "setstatus",
  description: "Make your own Distraced boyfriend meme",
  usage: "setstatus <online/idle/dnd>",
  enabled: false,
  aliases: [],
  category: "Utility",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){

        if(message.author.id !== config.ownerID) {
            return archieembed("imposter alert! Only the bot owner may use this command!", message.channel)
        }
        //if(!message.author.id === config.ownerID) return message.channel.send("imposter")

        const content = args.join(" ")
        const splitt = content.split('');

        const lol = new MessageEmbed()
        .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
        .setDescription("<a:error:815632261399445536> Please enter a status type!")
        .setColor(`#131313`)
        if (!splitt[0]) return message.channel.send(lol);


            if(content === 'dnd') {
                client.user.setStatus('dnd')
                const sux = new MessageEmbed()
                    .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                    .setDescription("<a:success:815632261927141426> Status changed to `do not disturb`!")
                    .setColor(`#131313`)
                    message.channel.send(sux)
            } else {
                if(content === 'online') {
                    client.user.setStatus('online')
                    const sux = new MessageEmbed()
                    .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                    .setDescription("<a:success:815632261927141426> Status changed to `online`!")
                    .setColor(`#131313`)
                    message.channel.send(sux)
                } else {
                    if(content === 'idle') {
                        client.user.setStatus('idle')
                        const sux = new MessageEmbed()
                    .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                    .setDescription("<a:success:815632261927141426> Status changed to `idle`!")
                    .setColor(`#131313`)
                    message.channel.send(sux)
                    } else {
                        if(content != ['dnd', 'online', 'idle']) {
                            const meh = new MessageEmbed()
                            .setAuthor(`${client.user.username}`, `${client.user.displayAvatarURL()}`)
                            .setDescription(`<a:error:815632261399445536> Please enter a **valid** status type!
                            **Options:**
                            dnd (do not disturb)
                            online
                            idle`)
                            .setColor(`#131313`)
                            return message.channel.send(meh)
                        } 
                    
                }
            }
        }
 
    }
}