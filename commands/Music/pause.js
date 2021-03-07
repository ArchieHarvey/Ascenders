const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
module.exports = {
  name: "pause",
  description: "Shows the current queue",
  usage: "queue",
  enabled: true,
  aliases: [],
  category: "Music",
  memberPermissions: [],
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

  async execute(client, message, args) {
    try {
      const { channel } = message.member.voice; // { message: { member: { voice: { channel: { name: "Allgemein", members: [{user: {"username"}, {user: {"username"}] }}}}}
      if (!channel)
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter("Requested by " + message.author.tag + " | Music Module", message.author.displayAvatarURL({ dynamic: true }))
          .setDescription(`<:denied:811890796806406174> **You have to be in a voice channel to play music.**`)
        );
      if (!client.distube.getQueue(message))
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter("Requested by " + message.author.tag + " | Music Module", message.author.displayAvatarURL({ dynamic: true }))
          .setDescription(`<:denied:811890796806406174> **I am not playing anything.**`)
        );
      if (client.distube.getQueue(message) && channel.id !== message.guild.me.voice.channel.id)
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter("Requested by " + message.author.tag + " | Music Module", message.author.displayAvatarURL({ dynamic: true }))
          .setDescription(`<:denied:811890796806406174> **You need to be in the same voice channel as me. \nChannel: \`${message.guild.me.voice.channel.name}\`**`)
        );
      if (client.distube.isPaused(message))
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter("Requested by " + message.author.tag + " | Music Module", message.author.displayAvatarURL({ dynamic: true }))
          .setDescription(`<:denied:811890796806406174> The music is already paused`)
        );
      message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter("Requested by " + message.author.tag + " | Music Module", message.author.displayAvatarURL({ dynamic: true }))
        .setTitle("⏸ Paused the Song")
      ).then(msg => msg.delete({ timeout: 4000 }).catch(e => console.log(e.message)))

      client.distube.pause(message);
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.channel.send(new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter("Requested by " + message.author.tag + " | Music Module", message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`<:denied:811890796806406174> | An error occurred`)
      );
    }
  }
}