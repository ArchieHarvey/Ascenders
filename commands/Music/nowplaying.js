const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error")

module.exports = {
  name: "nowplaying",
  description: "To show the music which is currently playing in this server",
  usage: "",
  enabled: true,
  aliases: ["np"],
  category: "Music",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,
  
  async execute(client, message, args, data){
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("There is nothing playing in this server.", message.channel);
    let song = serverQueue.songs[0]
    let thing = new MessageEmbed()
      .setAuthor("Now Playing")
      .setThumbnail(song.img)
      .setColor("BLUE")
      .addField("Name", song.title, true)
      .addField("Duration", song.duration, true)
      .addField("Requested by", song.req.tag, true)
      .setFooter(`Views: ${song.views} | ${song.ago}`, client.user.displayAvatarURL())
      .setTimestamp()
    return message.channel.send(thing)
  },
};
