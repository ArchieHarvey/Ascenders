const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const archieembed = require("../../util/archieembed");

module.exports = {
  name: "wikipedia",
  description: "Finds a Wikipedia Article by title",
  usage: "wiki [term]",
  enabled: true,
  aliases: ["wiki"],
  category: "Fun",
  memberPermissions: [],
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

  async execute(client, message, args, data) {
    const article = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        args.join(" ")
      )}`
    )
      .then(res => res.json())
      .catch(() => {
        throw "I couldn't find a wikipedia article with that title!";
      });

    if (!article.content_urls)
      return archieembed(
        "I couldn't find a wikipedia article with that title!",
        message.channel
      );
    const embed = new MessageEmbed()
      .setThumbnail("https://i.imgur.com/fnhlGh5.png")
      .addField(
        "More Info: ",
        `**[Click Here!](${article.content_urls.desktop.page})**`,
        true
      )
      .setURL(article.content_urls.desktop.page)
      .setTitle(article.title)
      .setDescription(article.extract)
      .setTimestamp()
      .setFooter(`© Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL());
    return message.channel.send({ embed });
  }
}