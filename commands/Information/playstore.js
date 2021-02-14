const Discord = require('discord.js')
const { Client, Message, MessageEmbed } = require("discord.js");
const PlayStore = require("google-play-scraper"); //npm i google-play-scraper
const Color = "RANDOM";
const archieembed = require("../../util/archieembed");

module.exports = {

    //Information about command
    name: "playstore",
    description: "Show Playstore Application Information Of Your Given Name!",
    usage: "Playstore <Application Name>",
    enabled: true,
    aliases: ["pstore", "googleplaystore", "ps"],
    category: "Fun",
    memberPermissions: [],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,
  
    //Execute to command once the settings have been checked
    async execute(client, message, args, data){
   if (!args[0])
    return archieembed("Please Give Application Name!", message.channel);

    PlayStore.search({
      term: args.join(" "),
      num: 1
    }).then(Data => {
      let App;

      try {
        App = JSON.parse(JSON.stringify(Data[0]));
      } catch (error) {
        return archieembed("No Application Found!", message.channel);
      };

      let Embed = new Discord.MessageEmbed()
        .setColor(Color)
        .setThumbnail(App.icon)
        .setURL(App.url)
        .setTitle(App.title)
        .setDescription(App.summary)
        .addField("Price", App.priceText, true)
        .addField("Developer", App.developer, true)
        .addField("Score", App.scoreText, true)
        .setFooter(`Requested By ${message.author.username} | ©Ascenders 2020 | v2.1.28`)
        .setTimestamp();

      return message.channel.send(Embed);
    });
    }
}       