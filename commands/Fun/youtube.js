const canvacord = require('canvacord')
const Discord = require('discord.js') 

module.exports = {
    name: "yt-commment",
  description: "comment youtube",
  usage: "yt-comment [text]",
  enabled: true,
  aliases: [""],
  category: "Fun",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
    let options = { 
        username: message.author.username, 
        content: args.join(' '), 
        avatar: message.author.displayAvatarURL({ dynamic: false, format: 'png' }), 
        dark: true}
        let image = await canvacord.Canvas.youtube(options); /*make sure to have await here */ 
        
        let attachment = new Discord.MessageAttachment(image, "comment.png");
        
        let newembed = new Discord.MessageEmbed() 
        .attachFiles([attachment]) 
        .setImage("attachment://comment.png") 
        .setFooter(`Requested By ${message.author.username}`, 
        message.author.displayAvatarURL()) 
        message.channel.send(newembed) }}