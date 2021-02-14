const { MessageEmbed } = require('discord.js')


module.exports = {
    name: "firstmessage",
  description: "Find the first message in the channel",
  usage: "",
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
        
		const fetchMessages = await message.channel.messages.fetch({
            after: 1,
            limit: 1,
          });
          const msg = fetchMessages.first();
      
        
        message.channel.send(
            new MessageEmbed()
              .setTitle(`First Messsage in ${message.guild.name}`)
              .setURL(msg.url)
              .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
              .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
              .setDescription("Content: " + msg.content)
              .addField("Author", msg.author, true)
              .addField('Message ID:', msg.id, true)
              .addField('Created On', message.createdAt.toLocaleDateString(), true)
              .addField('Created At', msg.createdAt)
              .addField('Jump', msg.url)
              .setTimestamp()
              .setFooter(`© Ascenders 2020`,  client.user.displayAvatarURL())
          );
		
    }
}