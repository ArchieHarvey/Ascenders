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
        if (!args.length) {
            return message.channel.send({
                embed: {
                    color: "RANDOM",
                    description: `Invalid command usage, try using it like: \n \`${data.guild.prefix}anime [search]\` \n\n Arguments: \n \`search\`: *Text (may include spaces)*`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: client.user.displayAvatarURL(),
                        text: `© Ascenders 2020`
                    }
                }
            })
        }
        let option = {
            url: `https://kitsu.io/api/edge/anime?filter[text]=${args.join(" ")}`,
            method: `GET`,
            headers: {
                'Content-Type': "application/vnd.api+json",
                'Accept': "application/vnd.api+json"

            },
            json: true
        }


        message.channel.send({
            embed: {
                color: "RANDOM",
                title: 'Fetching from Kitsu <a:AnimatedLoading:709735586608447488>',
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.displayAvatarURL(),
                    text: "© Ascenders 2021"
                }
            }
        }).then(msg => {
            get(option).then(body => {
                try {
                    let embed = new MessageEmbed()
                        .setURL(`https://kitsu.io/anime/${body.data[0].attributes.slug}`)
                        .setTitle(body.data[0].attributes.titles.en)
                        .setColor("RANDOM")
                        .setImage(body.data[0].attributes.coverImage && body.data[0].attributes.coverImage.original)
                        .setDescription(body.data[0].attributes.synopsis)
                        .setThumbnail(body.data[0].attributes.posterImage && body.data[0].attributes.posterImage.original)
                        .addField(":hourglass_flowing_sand: Status", body.data[0].attributes.status, true)
                        .addField(":star: Average Rating", body.data[0].attributes.averageRating, true)
                        .addField(":dividers: Type", body.data[0].attributes.subtype, true)
                        .addField(":minidisc: Total Episodes", body.data[0].attributes.episodeCount, true)
                        .addField(":trophy: Rank", `**TOP ${body.data[0].attributes.ratingRank}**`, true)
                        .addField(":stopwatch: Episode Duration", `${body.data[0].attributes.episodeLength} min`, true)
                        .addField("Age Rating", body.data[0].attributes.ageRating, true)
                        .addField(":calendar_spiral: Aired", `from **${body.data[0].attributes.startDate}** to **${body.data[0].attributes.endDate}**`, true)
                        .setTimestamp()
                        .setFooter("© Ascenders 2020", client.user.displayAvatarURL())
                    //.setImage(body.data[0].attributes.coverImage.large)
                    //try it


                    message.channel.send(embed)
                    msg.delete();

                } catch (err) {
                    msg.delete();
                    return archieembed(`Unable to find the requested anime`, message.channel);
                }



            }

            )
        })

    }
}