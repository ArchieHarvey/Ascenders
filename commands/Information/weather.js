const weather = require("weather-js");
const discord = require("discord.js");
const archieembed = require("../../util/archieembed");

module.exports = {
  name: "weather",
  description: "Get the weather of anywhere",
  usage: "weather [city|zipcode]",
  enabled: true,
  aliases: [],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

  async execute(client, message, args, data) {
    if (!args.length) {
      return message.channel.send({
        embed: {
          color: "RANDOM",
          description: `Invalid command usage, try using it like: \n \`${data.guild.prefix}weather [city|zipcode]\` \n\n Arguments: \n \`city|zipcode\`: *Text (may include spaces)*`,
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: "© Ascenders"
          }
        }
      });
    }

    weather.find({ search: args.join(" "), degreeType: "C" }, function(
      err,
      result
    ) {
      try {
        var location = result[0].location;
        var current = result[0].current;

        let embed = new discord.MessageEmbed()
          .setColor("#ff2050")
          .setDescription(`**${current.skytext}**`)
          .setAuthor(`Weather forecast for ${current.observationpoint}`)
          .addField("Latitude", location.lat, true)
          .addField("Longitude", location.long, true)
          .addField("Temperature", `${current.temperature}°C`, true)
          .addField("Feels like", `${current.feelslike}°C`, true)
          .addField("Sky Text", result[0].current.skytext, true)
          .addField("Humidity", result[0].current.humidity, true)
          .addField("Wind", result[0].current.winddisplay, true)
          .addField("Observation Time", result[0].current.observationtime, true)
          .addField("Degree Type", "Celsius", true)
          .addField("Humidity", `${current.humidity}%`, true)
          .addField("Timezone", `GMT${location.timezone}`, true)
          .setThumbnail(result[0].current.imageUrl);
        message.channel.send(embed);
      } catch (err) {
        return archieembed(
          "Unable To Get the data of Given location",
          message.channel
        );
      }
    });
    //LETS CHECK OUT PKG
  }
};
