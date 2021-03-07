const { get } = require("request-promise-native");
const { MessageEmbed } = require("discord.js");
const archieembed = require("../../util/archieembed");

module.exports = {
    name: "anime",
    description: "Get anime information",
    usage: "anime <anime_name>",
    enabled: true,
    aliases: ["kitsu"],
    category: "Anime",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {

        const invalid = new MessageEmbed()
            .setColor('RED')
            .setDescription(`Invalid command usage, try using it like: \n \`${data.guild.prefix}anime [search]\` \n\n Arguments: \n \`search\`: *Text (may include spaces)*`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (!args.length) return message.channel.send(invalid)

        let option = {
            url: `https://kitsu.io/api/edge/anime?filter[text]=${args.join(" ")}`,
            method: `GET`,
            headers: {
                'Content-Type': "application/vnd.api+json",
                'Accept': "application/vnd.api+json"
            },
            json: true
        }

        const fetching = new MessageEmbed()
            .setDescription(`Fetching from Kitsu.io <a:loading:814137977461801020>`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        message.channel.send(fetching).then(msg => {
            get(option).then(body => {
                try {
                    let embed = new MessageEmbed()
                        .setURL(`https://kitsu.io/anime/${body.data[0].attributes.slug}`)
                        .setTitle(body.data[0].attributes.titles.en)
                        .setColor("RANDOM")
                        .setImage(body.data[0].attributes.coverImage && body.data[0].attributes.coverImage.original)
                        .setDescription(body.data[0].attributes.synopsis)
                        .setThumbnail(body.data[0].attributes.posterImage && body.data[0].attributes.posterImage.original)
                        .addField('Info:', [
                            `**Age Rating: ** ${body.data[0].attributes.ageRating}`,
                            `**Rating Guide: **${body.data[0].attributes.ageRatingGuide}`,
                            `**Total Episodes: ** ${body.data[0].attributes.episodeCount} episodes`,
                            `**Episode Duration: **${body.data[0].attributes.episodeLength} min`,
                            `**Show Type: **${body.data[0].attributes.showType}`,
                            `**Status: **${body.data[0].attributes.status}`
                        ], true)
                        .addField('More Info:', [
                            `**Average Rating: **${body.data[0].attributes.averageRating}`,
                            `**Type: **${body.data[0].attributes.subtype}`,
                            `**Rank: **TOP ${body.data[0].attributes.ratingRank}`,
                            `**Age Rating: **${body.data[0].attributes.ageRating}`,
                            `**Aired from: **${body.data[0].attributes.startDate} to ${body.data[0].attributes.endDate}`
                        ], true)
                        .setTimestamp()
                        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    //.setImage(body.data[0].attributes.coverImage.large)
                    //try it

                    message.channel.send(embed)
                    msg.delete();
                } catch (err) {
                    msg.delete();
                    return archieembed(`**Error: ${err.message}**`, message.channel)

                }
            })
        })
    }
}