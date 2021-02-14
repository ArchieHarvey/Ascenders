const { MessageEmbed } = require('discord.js');

module.exports = {
  //Command Information
  name: "ping",
  description: "Displays the current API latency",
  usage: "ping",
  enabled: true,
  aliases: [],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, message, args, data) {
    const time = require('ms')
    const uptime = time(client.uptime)
    const msg = await message.channel.send("Pinging <a:AnimatedLoading:709735586608447488>");
    const Embed = new MessageEmbed()
      .setTitle("Pong!")
      .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
      .addField("My API Latency is:", `⏲️ ${Math.round(client.ws.ping)}ms`, true)
      .addField("My Latency is:", `⌛ ${msg.createdTimestamp - message.createdTimestamp}ms`, true)
      .addField('I have been up for:', uptime)
      .setColor('#fb644c')
      .setTimestamp()
      .setFooter("© Ascenders 2020", client.user.displayAvatarURL());
    msg.edit(Embed);
    msg.edit("\u200b");
  }
}
