const { MessageAttachment, MessageEmbed } = require('discord.js')
const Levels = require('discord-xp')
const canvacord = require('canvacord')
const db = require('../../reconDB');
const archieembed = require("../../util/archieembed")

module.exports = {

    //Information about command
    name: "leaderboard",
    description: "Adds a given Emoji to the server",
    usage: "[emoji]",
    enabled: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {
        const check = await db.has(`leveling-${message.guild.id}`);
        if (check === false) return archieembed(`**Leveling is disabled!**\n\nTo enable it use \`${data.guild.prefix}leveling enable\``, message.channel);
        
        const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 20);
        if (rawLeaderboard.length < 1) return reply("Leaderboard not found");

        const leaderboard = Levels.computeLeaderboard(client, rawLeaderboard)

        const lb = (await leaderboard).map(e => `${e.position}. \`${e.username}#${e.discriminator}\` Level: \`${e.level}\` XP: \`${e.xp.toLocaleString()}\``)


        const embed = new MessageEmbed()
            .setAuthor(`Rank Leaderboard | ${message.guild.name}`, message.guild.iconURL())
            .setDescription(`${lb.join("\n")}`)
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag}`)
        message.channel.send(embed)
    }
}
