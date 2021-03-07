const { ReactionPages } = require('reconlx');
const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: "longestuser",
    description: "Lists all members according to the longest duration of stay",
    usage: "",
    enabled: false,
    aliases: [],
    category: "Utility",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        const members = message.guild.members.cache
            .filter((m) => !m.user.bot)
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);

        const arrayOfMembers = members.array();
        const ids = [];
        arrayOfMembers.forEach((mem) => {
            ids.push(mem.user.id);
        })

        let index = 1;
        if (ids.length > 10) {
            const chunks = convertChunk(ids, 10);
            const arry = [];
            for (chunk of chunks) {
                const description = chunk.map((v) => `#${index++} **${message.guild.members.cache.get(v).user.tag}**`);
                arry.push(
                    new MessageEmbed()
                        .setTitle('Join Leaderboard in ' + message.guild.name)
                        .setDescription(description)
                        .setColor('RANDOM')
                )
            }
            ReactionPages(message, arry, true)
        } else {
            const description = ids.map((v) => `#${index++} **${message.guild.members.cache.get(v).user.tag}**`);
            message.channel.send(
                new MessageEmbed()
                    .setTitle('Join Leaderboard in ' + message.guild.name)
                    .setDescription(description)
                    .setColor('RANDOM')
                    .setFooter(`© Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
            )
        }
    }
}

function convertChunk(arr, size) {
    const array = [];
    for (let i = 0; i < arr.length; i += size) {
        array.push(arr.slice(i, i + size))
    }
    return array;
}