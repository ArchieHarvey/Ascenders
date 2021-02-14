const Discord = require("discord.js");
const { version } = require("discord.js");
const { MessageEmbed } = require("discord.js");
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

      const duration = moment
        .duration(client.uptime)
        .format(" D [days], H [hrs], m [mins], s [secs]");
      const botinfo = new Discord.MessageEmbed()
        .setAuthor(client.user.username)
        .setColor("#000000")
        .setThumbnail(client.user.displayAvatarURL())
        .addField("Versions", [
          `**Node.js Version:** ${process.version}`,
          `**Discord.js Version:** v${version}`
        ])
        .addField("SERVER", [
          `**Mem Usage:** ${(
            process.memoryUsage().heapUsed /
            1024 /
            1024
          ).toFixed(2)} MB/ ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
          `**Total Memory Usage:** ${(
            process.memoryUsage().heapTotal /
            1024 /
            1024
          ).toFixed(2)} MB`,
          `**CPU usage:** ${percent.toFixed(2)}%`,
          `**CPU:** ${os.cpus().map(i => `${i.model}`)[0]}`,
          `**Architecture:** ${os.arch()}`,
          `**Platform:** ${os.platform()}`,
          `**Uptime:** ${getUptime(client.uptime)}`
        ])
        .addField(
          "🌐 Servers",
          `Serving ${client.guilds.cache.size} servers.`,
          true
        )
        .addField(
          "📺 Channels",
          `Serving ${client.channels.cache.size} channels.`,
          true
        )
        .addField("👥 Server Users", `Serving ${client.guilds.cache.reduce((c, g) => c + g.memberCount, 0)}`, true)
        .addField("⏳ Ping", `${Math.round(client.ws.ping)}ms`, true)
        .addField("Join Date", client.user.createdAt, true)
        .addField(":desktop: Server Info", `Cores: ${os.cpus().length}`, true)
        .addField(":clock1: Uptime", `**${getUptime(client.uptime)}**`, true)
        .addField(
          "Links",
          [
            ":star: [GitHub Repository](https://github.com/ArchieHarvey/theascenders)",
            ":robot: [Upvote me at top.gg](https://top.gg/bot)",
            `:envelope_with_arrow: [Invite me to your server](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`,
            ":video_game: [Join our Discord Server](https://discord.gg/gpkDA4RdX6)"
          ].join("\n")
        )
        .setFooter(
          `Created By: ${message.author.tag} | © Ascenders 2020`,
          message.author.displayAvatarURL()
        )
        .setTimestamp()

        .setTitle("__**Stats:**__")
        .setColor("RANDOM");

      message.channel.send(botinfo);
    });
  }
};
