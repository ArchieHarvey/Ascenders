const { Discord, discord } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const fetch = require("node-fetch")

module.exports = {
    name: "githubuser",
  description: "Github User Account Information!",
  usage: "[name]",
  enabled: true,
  aliases: [""],
  category: "Info",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){

       try {

  if (!args[0]) return message.channel.send(`Please Give Me A Username!`)
    
  fetch(`https://api.github.com/users/${args.join('-')}`)
    .then(res => res.json()).then(body => {
      if(body.message) return message.channel.send(`User Not Found | Please Give Me A Valid Username!`);
    let { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, bio } = body;

            const embed = new MessageEmbed()
            .setAuthor(`${login} Information!`, avatar_url)
            .setColor(`#211F1F`)
            .setThumbnail(`${avatar_url}`)
            .addField(`Username`, `${login}`, true)
            .addField(`ID`, `${id}`,true)
            .addField(`Bio`, `${bio || "No Bio"}`)
            .addField(`Public Repositories`, `${public_repos || "None"}`, true)
            .addField(`Followers`, `${followers}`, true)
            .addField(`Following`, `${following}`, true)
            .addField(`Location`, `${location || "No Location"}`,true)
            .addField(`Account Created`, moment.utc(created_at).format("dddd, MMMM, Do YYYY"),true)
            .setFooter(`${message.author.username}`)

            message.channel.send(embed)

    })

        } catch (error) {
            console.log(`[Commands] [github] Error :\n`, error);
            return message.channel.send(`Something Went Wrong Try Again Later!`)
        }
    }
};