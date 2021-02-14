const archieembed = require("../../util/archieembed")
const config = require('../../config.json')
const request = require('node-superfetch');

module.exports = {
  name: "ip",
  description: "Sends the IP of the server",
  usage: "",
  enabled: true,
  aliases: [""],
  category: "Owner",
  memberPermissions: [],
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  //Settings for command
  nsfw: false,
  ownerOnly: true,
  cooldown: 0,

  async execute(client, message, args, data) {
    if (message.author.id !== config.ownerID) return archieembed("ERROR 404", message.channel)
    const { body } = await request
      .get('https://api.ipify.org/')
      .query({ format: 'json' });
    await message.author.send(body.ip).catch(() => message.reply("Can't send DM to you! Make sure your DM's are open."));
     // message.channel.send("User has DMs closed or has no mutual servers with the bot:(");
    
    // return message.channel.send('📬 Sent the IP to your DMs!')



  }
}
