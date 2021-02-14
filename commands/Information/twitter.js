
const Discord = require("discord.js")
const request = require("node-superfetch") //npm i node-superfetch
const {stripIndents} = require("common-tags") //npm i common-tags
const twitter = require("twitter-api.js") //npm i twitter-api.js
module.exports = {

    //Information about command
    name: "twitter",
    description: "Show Steam Information Of Your Given Name!",
    usage: "",
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
    let user = args[0]
    if(!user) return message.channel.send("Provide your twitter name")
    
    try {
      const body = await twitter.users(user)
      const tweet = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setAuthor(`@${body.screen_name.toLowerCase()}`, body.verified ? "https://emoji.gg/assets/emoji/6817_Discord_Verified.png" : null)
      .setDescription(stripIndents` ${body.description}
      \`•\` Followers: **${(body.followers_count).toLocaleString()}**
      \`•\` Following: **${(body.friends_count).toLocaleString()}**
      \`•\` Tweets: **${(body.statuses_count).toLocaleString()}**
      \`•\` Account Created At: ${body.created_at}`)
      .setFooter(`Twitter ID: ${body.id}`, "https://abs.twimg.com/favicons/twitter.ico")
      .setThumbnail(body.profile_image_url_https.replace('_normal', ''))
      .setImage(body.profile_banner_url)
      message.channel.send(tweet)
    } catch (e) {
      if(e.status === 403) return message.channel.send("This user private mode, or deleted account")
      else if(e.status === 404) return message.channel.send("Not Found")
      else return mmessagesg.channel.send(`Unknown error: \`${e.message}\``)
    }
  }
}