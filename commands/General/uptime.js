const { MessageEmbed } = require('discord.js')
const Discord = require('discord.js');
const ms = require("ms");
const os = require('os');
module.exports = {
    //Command Information
    name: "uptime",
    description: "To see bots uptime",
    usage: "uptime",
    enabled: true,
    aliases: [],
    category: "General",
    memberPermissions: [],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {

    var getUptime = function(millis) {
        var dur = {};
        var units = [{label: "milliseconds", mod: 1000},
                     {label: "seconds", mod: 60},
                     {label: "minutes", mod: 60},
                     {label: "hours", mod: 24},
                     {label: "days", mod: 31}];
    
        units.forEach(function(u) {millis = (millis - (dur[u.label] = (millis % u.mod))) / u.mod;});
    
        var nonZero = function(u) {return dur[u.label];};
        dur.toString = function() {
            return units
                .reverse()
                .filter(nonZero)
                .map(function(u) {
                    return dur[u.label] + " " + (dur[u.label] == 1 ? u.label.slice(0, -1) : u.label);
                })
                .join(', ');
        };
        return dur;
    };

let myDate = new Date(client.readyTimestamp);
        var embed = new MessageEmbed()
        .setAuthor(client.user.username)
        .setThumbnail(client.user.displayAvatarURL())
        .addField("Bot Uptime", [
            `:white_check_mark: Uptime: **${getUptime(client.uptime)}**`])
        .setFooter(`Ready Timestamp: ${myDate.toString()}`)
        .setColor("GREEN")
        .setTimestamp()
        .setFooter("© Ascenders 2020", client.user.displayAvatarURL())
        message.channel.send(embed);
    }
};