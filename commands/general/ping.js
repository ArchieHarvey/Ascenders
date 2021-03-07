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
    const uptime = `\`\`\`ini\n ${time(client.uptime)} \`\`\``;
    const msg = await message.channel.send("Pinging <a:loading:814137977461801020>");
    const timestamp = (message.editedTimestamp) ? message.editedTimestamp : message.createdTimestamp;
    const latency = `\`\`\`ini\n ${(msg.createdTimestamp - timestamp)}ms \`\`\``;
    const apiLatency = `\`\`\`ini\n ${Math.round(message.client.ws.ping)}ms \`\`\``;
    
    const Embed = new MessageEmbed()
      .setTitle("Pong!")
      .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
      .addField('⌛ Latency', latency, true)
      .addField('⏲️ API Latency', apiLatency, true)
      .addField('I have been up for:', uptime)
      .setColor('#fb644c')
      .setTimestamp()
      .setFooter(`© Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL());
    msg.edit(Embed);
    msg.edit("\u200b");
  }
}
