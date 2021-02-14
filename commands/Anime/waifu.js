const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");


module.exports = {
  name: "waifu",
description: "Get a random waifu.",
usage: "waifu",
enabled: true,
aliases: [],
category: "Anime",
memberPermissions: [],
botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
//Settings for command
nsfw: false,
ownerOnly: false,
cooldown: 0,

  async execute(client, message, args, data){

    const { url } = await fetch(`https://nekos.life/api/v2/img/${message.channel.nsfw ? "nsfw_" : ""}avatar`)
    .then((res) => res.json());

  const embed = new MessageEmbed()
    .setTitle(`${message.channel.nsfw ? "NSFW " : ""}Anime Avatar`)
    .setImage(url)
    .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 32 }));

  return message.channel.send({ embed });
}
}