const { MessageEmbed } = require("discord.js");

module.exports = {
    //Command Information
    name: "invite",
    description: "To add/invite the bot to your server",
    usage: "info",
    enabled: true,
    aliases: ["inv"],
    category: "General",
    memberPermissions: [],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {
    
    //set the permissions id here (https://discordapi.com/permissions.html)
    var permissions = 8;
    
    let invite = new MessageEmbed()
    
    .setAuthor(`Invite ${client.user.username} to your server`)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`You can invite me to your server using the following link: [Invite Me](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot)`)
    .addField("**Other Links**","[Support Server](https://discord.gg/gpkDA4RdX6) | [Github Repository](https://github.com/ArchieHarvey/Ascenders)")
   //.setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=${permissions}&scope=bot`)
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(`© Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
    return message.channel.send(invite);
  },
};
