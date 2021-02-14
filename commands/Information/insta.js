const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags");
const insta = require('user-instagram');
// const { colors } = require('../../config colors/colors')

module.exports = {

  //Information about command
  name: "insta",
  description: "Get the instagram of the requested user",
  usage: "insta <name>",
  enabled: true,
  aliases: ["instagram"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

  //Execute to command once the settings have been checked
  async execute(client, message, args, data){
    //get the name to search for
    let name = args[0];

    //if there is no name send a message to the channel
    if(!name) return message.channel.send('Enter an account to search for!');

    await insta(name).then(res => {

      //create a new embed with the result info and send it to the channel
      let embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(res.fullName)
        .setURL(res.link)
        .setThumbnail(res.profilePicHD)
        .addField('Profile info:', stripIndents`**Username:** ${res.username}
        **Full name:** ${res.fullName ? res.fullName : "Unknown"}
        **Biography:** ${res.biography.length == 0 ? 'None' : res.biography}
        **Posts:** ${res.postsCount}
        **Followers:** ${res.subscribersCount}
        **Following:** ${res.subscribtions}
        **Private:** ${res.isPrivate ? 'Yes 🔐' : 'No 🔓'}`)
        .setFooter(`© ${message.guild.me.displayName}`, client.user.displayAvatarURL());

      message.channel.send(embed);
    }).catch(err => {
      console.log(err);
      return message.reply("Are you sure that account exists?");
    });
  }
}