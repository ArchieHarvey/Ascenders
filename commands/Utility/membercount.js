const { MessageEmbed } = require('discord.js')
const archieembed = require("../../util/archieembed")

module.exports = {
  name: "membercount",
  description: "No of members in the server",
  usage: "",
  enabled: true,
  aliases: [],
  category: "Utility",
  memberPermissions: [],
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

  async execute(client, message, args, data) {
    const members = message.guild.members.cache.array();
    const memberCount = members.length;
    const online = members.filter((m) => m.presence.status === 'online').length;
    const offline = members.filter((m) => m.presence.status === 'offline').length;
    const dnd = members.filter((m) => m.presence.status === 'dnd').length;
    const afk = members.filter((m) => m.presence.status === 'idle').length;
    const bots = members.filter(b => b.user.bot).length;
    const embed = new MessageEmbed()
      .setAuthor(`${message.guild.name}\'s membercount `)
      .setThumbnail(message.guild.iconURL())
      .setDescription(`This discord server has ${message.guild.memberCount} members out of which ${bots} are bots\n\n${online} are online\n${offline} are offline\n${dnd} are dnd\n${afk} are idle`)
      .setTimestamp()
      .setFooter(`© Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
      message.channel.send(embed)
  }
}