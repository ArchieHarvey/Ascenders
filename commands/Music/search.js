const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { getTracks, getPreview } = require("spotify-url-info")
module.exports = {
    name: "search",
    description: "Shows the current queue",
    usage: "queue",
    enabled: true,
    aliases: [],
    category: "Music",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {

        try {

            const { channel } = message.member.voice;
            if (!channel) return message.channel.send(`<:denied:811890796806406174> You need to be in a voice channel.`)

            if (client.distube.getQueue(message) && channel.id !== message.guild.me.voice.channel.id)
                return message.channel.send(`<:denied:811890796806406174> You need to me in the same voice channel as me. Channel I am in: \`${message.guild.me.voice.channel.name}\``)

            if (!args[0]) return message.channel.send(`<:denied:811890796806406174> I need something to search. I cant search nothing`)

            let result = await client.distube.search(args.join(" "));
            let searchresult = "";
            for (let i = 0; i < 10; i++) {
                try {
                    searchresult += `**${i + 1}.** [${result[i].name}](${result[i].url}) - \`${result[i].formattedDuration}\`\n`
                } catch {
                    searchresult = "\n";
                }
            }
            message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(`Search Result for: ${args.join(" ")}`.substr(0, 256))
                .setDescription(searchresult.substr(0, 2048))
                .setTimestamp()
            ).then(msg => {
                msg.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000, errors: ["time"] }).then(collected => {
                    let userinput = collected.first().content;
                    if (Number(userinput) <= 0 && Number(userinput) > 10) {
                        message.reply("Playing the first track")
                        userinput = 0;
                    }
                    client.distube.play(message, result[userinput - 1].url);
                }).catch(e => {
                    console.log(String(e.stack).bgRed)
                    return message.channel.send(new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTitle(`<:denied:811890796806406174> An Error Occured`)
                    );
                })
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`<:denied:811890796806406174> An Error Occured`)
            );
        }
    }
}