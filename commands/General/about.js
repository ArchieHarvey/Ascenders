const { MessageEmbed } = require("discord.js");

module.exports = {
    //Command Information
    name: "about",
    description: "About The Ascenders",
    usage: "about",
    enabled: true,
    aliases: [],
    category: "General",
    memberPermissions: [],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {
    let embed = new MessageEmbed()
      .setAuthor(client.user.username, client.user.displayAvatarURL())
      .setColor(0xd353ef)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(
        `**Hello! I am a multi-purpose bot built for most of the necessary moderation required. I am still under development. Type**: \`help\` **to see my commands!**`)
      .addFields(
        { name: 'Invite Bot', value: `[Click Me!](https://discordapp.com/oauth2/authorize?&client_id=${client.user.id}&scope=bot&permissions=8)`, inline: true },
        { name: 'Github', value: `[Github](https://github.com/ArchieHarvey/Ascenders)`, inline: true },
        { name: 'Youtube', value: `[Ambitunes Music](https://www.youtube.com/channel/UC9gsOMEir7yEOXaQSPxNJ4Q)`, inline: true },
        { name: 'Youtube', value: `[Mr Master](https://www.youtube.com/channel/UCZVqfKCVxlKVZM18LgG6dfg)`, inline: true }
      )
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag} | © Ascenders 2020`, client.user.displayAvatarURL())
    message.channel.send({ embed });
  }
};
