const { MessageEmbed } = require("discord.js");
const AppleStore = require("app-store-scraper");

module.exports = {

  //Information about command
  name: "applestore",
  description: "Show Apple store Application Information Of Your Given Name!",
  usage: "Applestore <Application Name>",
  enabled: true,
  aliases: ["astore", "as", "appstore"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

  //Execute to command once the settings have been checked
  async execute(client, message, args, data){
    AppleStore.search({

        term: args.join(" "),
  
        num: 1,
  
        lang: 'en-us'
  
      }).then(Data => {
  
        let App;
  
        try {
  
          App = JSON.parse(JSON.stringify(Data[0]));
  
        } catch (error) {
  
          return message.channel.send(
  
            `No Application found! - ${message.author.username}!`
  
          );
  
        }
  
        
  
        let Description = App.description.length > 200 ? `${App.description.substr(0, 200)}...` : App.description
  
        let Price = App.free ? "FREE" : `$${App.price}`;
  
        let Score = App.score.toFixed(1);
  
        let Embed = new MessageEmbed()
  
          .setColor("#DDA0DD")
  
          .setThumbnail(App.icon)
  
          .setURL(App.url)
  
          .setTitle(`${App.title}`)
  
          .setDescription(Description)
  
          .addField(`Price`, Price, true)
  
          .addField(`Developer`, App.developer, true)
  
          .addField(`Score`, Score, true)
  
          .setFooter(`Requested By ${message.author.username}`)
  
          .setTimestamp();
  
        return message.channel.send(Embed);
  
      });
  }
}