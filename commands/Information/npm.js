const { MessageEmbed } = require("discord.js")

const moment = require('moment');
const { stripIndents } = require('common-tags');
const npm = require('search-npm-registry');

module.exports = {

  //Information about command
  name: "npm",
  description: "Give npm package information",
  usage: "npm <package>",
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
    const argsNPM = args.join(" ");

    // Input Checking
    (async () => {

      if (!argsNPM) return message.channel.send(`<:npm:769715335535263754> **Please specify something that you want to search in the NPM library!**`);

      const results = await npm().text(argsNPM).size(5).search();
      if (!results || results.length < 1) return message.reply('Failed to find anything using the specified query in NPM library. Please try again.')

      // Executing
      const result = results[0];
      const maintainers = [];
      for (let i = 0; i < results[0].maintainers.length; i++) {
        maintainers.push(results[0].maintainers[i].username);
      }

      const em = new MessageEmbed()
        .setAuthor(result.name, 'https://i.imgur.com/24yrZxG.png', 'https://www.npmjs.com/')
        .setColor('ORANGE')
        .setDescription(stripIndents`
    ${result.description ? result.description : null}
    :up: Version: ${result.version}
    :bust_in_silhouette: Author: ${result.publisher.username}
    :alarm_clock: Modified: ${moment(result.date).fromNow()}
    :busts_in_silhouette: Maintainers: ${maintainers.join(', ')}
    Keywords: ${result.keywords && result.keywords.length > 0 ? result.keywords.map(k => `\`${k}\``).join(', ') : 'none'}
    Download: [${result.name}](${result.links.npm})
    `);
      return message.channel.send(em);
    })()
  }
}