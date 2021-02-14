const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {
	name: "resume",
  description: "To resume the paused music",
  usage: "",
  enabled: true,
  aliases: [],
  category: "Music",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,
  
	async execute(client, message, args, data){
    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      let xd = new MessageEmbed()
      .setDescription("▶ Resumed the music for you!")
      .setColor("YELLOW")
      .setAuthor("Music has been Resumed!")
      .setTimestamp()
      .setFooter("© Ascenders 2020", client.user.displayAvatarURL())

      return message.channel.send(xd);
    }
    return sendError("There is nothing playing in this server.", message.channel);
  },
};
