const Discord = require("discord.js");
const { version } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");
const os = require("os");
const moment = require("moment");
const m = require("moment-duration-format");
let cpuStat = require("cpu-stat");
const ms = require("ms");
let days = 0;
let week = 0;

module.exports = {
    //Command Information
    name: "bot-info",
    description: "Get the current stats of the bot",
    usage: "bot",
    enabled: true,
    aliases: ["bot"],
    category: "General",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {
        //command
        let cpuLol;
        cpuStat.usagePercent(function (err, percent, seconds) {
            if (err) {
                return console.log(err);
            }
            var getUptime = function (millis) {
                var dur = {};
                var units = [
                    { label: "milliseconds", mod: 1000 },
                    { label: "seconds", mod: 60 },
                    { label: "minutes", mod: 60 },
                    { label: "hours", mod: 24 },
                    { label: "days", mod: 31 }
                ];

                units.forEach(function (u) {
                    millis = (millis - (dur[u.label] = millis % u.mod)) / u.mod;
                });

                var nonZero = function (u) {
                    return dur[u.label];
                };
                dur.toString = function () {
                    return units
                        .reverse()
                        .filter(nonZero)
                        .map(function (u) {
                            return (
                                dur[u.label] +
                                " " +
                                (dur[u.label] == 1 ? u.label.slice(0, -1) : u.label)
                            );
                        })
                        .join(", ");
                };
                return dur;
            };
            const something = `\`\`\`ini\n${getUptime(client.uptime)}\`\`\``
            const duration = moment
                .duration(client.uptime)
                .format(" D [days], H [hrs], m [mins], s [secs]");

            const botinfo = new MessageEmbed()
                .setAuthor(client.user.username)
                .setColor("#000000")
                //.setThumbnail(client.user.displayAvatarURL())
                .addField("Client Versions", [
                    `**<:nodejs:814189797920342098> Node.js Version:** ${process.version}`,
                    `**<:discordjs:814189798486573066> Discord.js Version:** v${version}`,
                    `**Mongoose:** v${mongoose.version}`,
                    `**<:folder:814190480987783198> Directory:** ${os.tmpdir()}`
                ], true)
                .addField("Client", [
                    `**:hourglass_flowing_sand: Ping:** ${Math.round(client.ws.ping)}ms`,
                    `**<:servers:814196992561381407> Guilds:** ${client.guilds.cache.size}`,
                    `**<:users:814191406515880007> Users:** ${client.guilds.cache.reduce((c, g) => c + g.memberCount, 0)}`,
                    `**<:channels:814197987915989073> Channels:** ${client.channels.cache.size}`,
                    `**:slight_smile: Emojis: ** ${client.emojis.cache.size}`
                ], true)
                .addField("\u200b", "\u200b", true)
                .addField("Operating System", [
                    `**Name:** ${os.version()}`,
                    `**Type:** ${os.type()}`,
                    `**Platform:** ${os.platform()}`,
                    `**Hostname:** ${os.hostname()}`,
                    `**Build:** ${os.release()}`,
                    `**Architecture:** ${os.arch()}`
                ], true)
                .addField("Server Stats", [
                    `**CPU:** ${os.cpus().map(i => `${i.model}`)[0]}`,
                    `**Core Count:** ${os.cpus().length} cores`,
                    `**Clock Speed:** ${os.cpus().map(i => `${i.speed / 1000}`)[0]} GHz`,
                    `**CPU Usage:** ${percent.toFixed(2)}%` 
                ], true)
                .addField('\u200b', '\u200b', true)
                .addField("Memory", [
                    `**Total Heap Used:** ${(
                        process.memoryUsage().heapUsed /
                        1024 /
                        1024
                    ).toFixed(2)} MB/ ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
                    `**Total Heap Total:** ${(
                        process.memoryUsage().heapTotal /
                        1024 /
                        1024
                    ).toFixed(2)} MB/ ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
                    `**Total Memory:** ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`
                ], true)
                              
                
                .addField('Uptime:', something)
                .addField("Links", `<:github:814185028845961237>  [GitHub](https://github.com/ArchieHarvey/Ascenders) | :link:  [Invite Me](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot) | :mailbox_with_mail:  [Support Server](https://discord.gg/gpkDA4RdX6)`)
                  //":robot: [Upvote me at top.gg](https://top.gg/bot)",
                  
                
                .setFooter(
                    `Created and Managed By: Archie, Feronik, MrMaster, shivz | © Ascenders ${new Date().getFullYear()}`,
                    client.user.displayAvatarURL()
                )
                .setTimestamp()
                .setColor("RANDOM");

            message.channel.send(botinfo);
        });
    }
};
