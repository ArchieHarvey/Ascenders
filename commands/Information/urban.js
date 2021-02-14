const Discord = require('discord.js')
const urban = require('urban.js')

module.exports = {

    //Information about command
    name: "urban",
    description: "Shows you a deffinition from urban dictionary",
    usage: "[your word]",
    enabled: true,
    aliases: [],
    category: "Information",
    memberPermissions: [],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,
  
    //Execute to command once the settings have been checked
    async execute(client, message, args, data){
  //command
  const bargs =  message.content.split(' ');
  const searchString = bargs.slice(1).join(' ')
  if(!searchString)return message.channel.send(`You have to type in word`)
  
  
  
urban(searchString).then(urbans=>{
  
  message.channel.send({embed: {
          
      description: `__**${urbans.word}**__\n\n**Definition**\n${urbans.definition}\n\n**Example**\n${urbans.example}\n\n**Tags:** ${urbans.tags}\n\n👍 **${urbans.thumbsUp}** *Thumbs Up* **|** 👎 **${urbans.thumbsDown}** *Thumbs Down*`,
      author: {
          name: message.author.username,
          icon_url: message.author.avatarURL,
      },
      color: 0xff0000,
  

      timestamp: new Date(),
  
  }
})
})

  }
  };