const discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name: "eject",
  description: "among us eject",
  usage: "eject <user>",
  enabled: true,
  aliases: ["c4", "cf"],
  category: "Games",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" , "ADD_REACTIONS"],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        const user = message.mentions.users.first()
    const imp = [true, false];
    const imposter = imp[Math.floor(Math.random() * imp.length)];
    const crew = ["black", "blue", "brown", "cyan", "darkgreen", "lime", "orange", "pink", "purple", "red", "white", "yellow"]
    const crewmate = crew[Math.floor(Math.random() * crew.length)];

    if(!user) {
      return message.channel.send(`${message.author} Please specify a user to eject by mentioning them!`)
    }

    const bruh = await fetch(`https://vacefron.nl/api//ejected?name=${user.username}&impostor=${imposter}&crewmate=${crewmate}`)

    const embed = new discord.MessageEmbed()
      .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.displayAvatarURL())
      .setTitle(`${message.author.username} decided to eject ${user.username}`)
      .setFooter(message.author.username)
      .setColor("BLUE")
      .setDescription(`[Click here, if the image didn't load!](${bruh.url})`)
      .setImage(`${bruh.url}`)
      .setTimestamp();

    message.channel.send(embed);
    }
}