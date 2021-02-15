const canvacord = require("canvacord")
const Discord = require("discord.js")
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "spotify",
    description: "Makes a spotify status card",
    usage: "spotify (user)",
    enabled: false,
    aliases: ['spot', 'sy'],
    category: "Fun",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        if (message.author.bot) return

        let user;

        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0]).user;
        } else {
            user = message.author;
        }

        let status;
        if (user.presence.activities.length === 1) status = user.presence.activities[0];
        else if (user.presence.activities.length > 1) status = user.presence.activities[1];

        if (user.presence.activities.length === 0 || status.name !== "Spotify" && status.type !== "LISTENING") {
            return archieembed("This user is not listening in Spotify", message.channel);
        }

        if (status !== null && status.type === "LISTENING" && status.name === "Spotify" && status.assets !== null) {
            let image = `https://i.scdn.co/image/${status.assets.largeImage.slice(8)}`,
                name = status.details,
                artist = status.state,
                album = status.assets.largeText;

            const card = new canvacord.Spotify()
                .setAuthor(artist)
                .setAlbum(album)
                .setStartTimestamp(status.timestamps.start)
                .setEndTimestamp(status.timestamps.end)
                .setImage(image)
                .setTitle(name);

            card.build()
                .then(buffer => {
                    canvacord.write(buffer, "spotify.png");

                    let attachment = new Discord.MessageAttachment(buffer, "spotify.png");
                    return message.channel.send(attachment);
                })
        }
    }
}