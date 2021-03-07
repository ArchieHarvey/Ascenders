const discord = require("discord.js");
const imdb = require("imdb-api");

module.exports = {

  //Information about command
  name: "imdb",
  description: "Get the information about series and movie",
  usage: "imdb <name>",
  enabled: true,
  aliases: [],
  category: "Fun",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

  //Execute to command once the settings have been checked
  async execute(client, message, args, data){
    if(!args.length) {
      return message.channel.send({embed: {
        color: "RANDOM",
        description: `Invalid command usage, try using it like: \n \`${data.guild.prefix}imdb [movie/series]\` \n\n Arguments: \n \`movie/series\`: *Name of Movie or Series (may include spaces)*`,
        timestamp: new Date(),
        footer: {
                      icon_url: client.user.displayAvatarURL(),
                      text: `© Ascenders ${new Date().getFullYear()}`
    }}
    })
    }
    
    const imob = new imdb.Client({apiKey: "5e36f0db"}) //imdb api
    
    let movie = await imob.get({'name': args.join(" ")})
    
    let embed = new discord.MessageEmbed()
    .setTitle(movie.title)
    .setColor("#ff2050")
    .setThumbnail(movie.poster)
    .setDescription(movie.plot)
    .setFooter(`Ratings: ${movie.rating}`, client.user.displayAvatarURL())
    .setTimestamp()
    .addField("Details:", [
      `**Year:** ${movie.year}`,
      `**Rated:**  ${movie.rated}`,
      `**Released:** ${movie.released}`,
      `**Runtime:** ${movie.runtime}`,
      `**Genre:** ${movie.genres}`
    ], true)
    .addField("Details:", [
      `**Country:** ${movie.country}`,
      `**Languages:** ${movie.languages}`,
      `**Type:** ${movie.type}`,
      `**Actors:** ${movie.actors}`,
      `**Directors:** ${movie.director}`
    ], true)
    .addField("Details:", [
      `**Writer:** ${movie.writer}`,
      `**Awards:** ${movie.awards}`,
      `**Production:** ${movie.production}`,
      `**Box Office:** ${movie.boxoffice}`
    ])
    
    message.channel.send(embed)
    
    
    
  }

}
