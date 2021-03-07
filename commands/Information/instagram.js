const Discord = require("discord.js");
const helper = require("./../../helpers/Stats/Instagram.js");
const { stripIndents } = require("common-tags")
module.exports = {

  //Information about command
  name: "instagram",
  description: "Get the instagram of the requested user",
  usage: "insta <name>",
  enabled: true,
  aliases: ["ig", "insta"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

  //Execute to command once the settings have been checked
  async execute(client, message, args, data){
       /* const name = args.join(" ");

        if (!name) return message.channel.send("Please provide your instagram name")
      try {
        const account = await instagram.user(name)
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(account.username)
            .setURL(`https://instagram.com/${name}`)
            .setThumbnail(account.profile_pic_url_hd)
            .addField("Profile information", stripIndents`
            Username: **${account.username}**
            Full name: **${account.full_name ? account.full_name : "Unknown"}**
            Bio: **${account.biography ? account.biography : "No Bio"}**
            Posts: **${account.edge_owner_to_timeline_media.count}**
            Followers: **${account.edge_followed_by.count}**
            Following: **${account.edge_follow.count}**
            Private: **${account.is_private ? "Yes 🔐" : "No 🔓"}**`)
        .setFooter(account.username, account.is_verified ? "https://emoji.gg/assets/emoji/6817_Discord_Verified.png" : null)
        message.channel.send(embed);
      } catch (e) {
        message.channel.send(`Sorry i can't find this user`)
      }*/
      let userID = !args[0] ? "_archiexd_" : args[0];

      let instaData = await helper.fetchAccount(userID)

      if(!instaData){
        return message.channel.send("Unable to find the mentioned Instagram account.")
      };
      // Get the top liked image
      let topImage;
      if(instaData.imageData.length > 0){
        topImage = instaData.imageData[0];
      }else{
        topImage = {
          likes: 0,
          comments: 0,
          image: message.client.user.displayAvatarURL()
        }
      }

      let embed = new Discord.MessageEmbed()
      .setTitle(instaData.name)
      .setURL(`https://www.instagram.com/${instaData.id}`)
      .setThumbnail(instaData.image)
      .addField("Profile information", stripIndents`
      Username: **${instaData.name}**
      Bio: ${instaData.bio}
      Posts: **${instaData.posts}**
      Followers: **${instaData.followers}**
      Following: **${instaData.following}**
      Private: **${instaData.private}**
      Verified: **${instaData.verified}**`
      )
      .setImage(topImage.image)
      .setFooter(`👍 ${topImage.likes} 💬 ${topImage.comments}`)
      .setColor(data.config.color)

      return message.channel.send(embed)
    }
}