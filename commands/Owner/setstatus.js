const archieembed = require("../../util/archieembed")
const config = require('../../config.json')

module.exports = {
    name: "setname",
  description: "Restarts the bot!",
  usage: "announce [channel] [message]",
  enabled: true,
  aliases: [""],
  category: "Owner",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: true,
  cooldown: 0,

    async execute(client, message, args, data){
        const setStatus = message.content.split(' ');

    if(message.author.id !== config.ownerID){
        return message.channel.send("You don't have the permissions to use this command!");
    }
    
    try{
        client.user.setUsername(newName[1])
            .then(user => message.channel.send(`My new username is **${user.username}**`))
            .catch(console.error);
    }
    catch(error){
        message.channel.send("I could not set my new username :sob:");
    }
    }
}