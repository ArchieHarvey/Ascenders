const moment = require("moment");
const { MessageEmbed } = require("discord.js");
require("moment-duration-format");
const Discord = require('discord.js')
const speedTest = require('speedtest-net');

module.exports = {
    //Command Information
    name: "speedtest",
    description: "Runs a speedtest",
    usage: "speedtest",
    enabled: true,
    aliases: [],
    category: "General",
    memberPermissions: [],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {
        {
            let embed = new MessageEmbed()
                .setColor(`RANDOM`)
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .addField("SPEEDTEST", [
                    `\u200B`,
                    `**Please wait <a:AnimatedLoading:709735586608447488>**`,
                    `\nWe are running a speedtest for you!`])
                .setTimestamp()
                .setFooter("© Ascenders 2020", client.user.displayAvatarURL())
                 let msg = await message.channel.send(embed)
                 const speed = speedTest({maxTime: 5000});
    speed.on('data', async (data) => {
        embed.fields.pop()
            embed.addField('---------------------------------------------------------------------------------------', '__**Speedtest Data**__')
            embed.addField(`**Ping**`, `${data.server.ping}ms`, true)
            embed.addField('**Download Speed**', `${data.speeds.download} Mbps`, true)
            embed.addField('**Upload Speed**', `${data.speeds.upload} Mbps`, true)
            embed.addField('**ISP Rating**', `${data.client.isprating}`, true)
            embed.addField('**RAW Download Speed**', `${data.speeds.originalDownload}bytes`, true)
            embed.addField('**RAW Upload Speed**', `${data.speeds.originalUpload}bytes`, true)
            embed.addField('---------------------------------------------------------------------------------------', '__**Server Data**__')
            embed.addField('**Country**', `${data.server.country}`, true)
            embed.addField('**City**', `${data.server.location}`, true)
            embed.addField('**Distance**', `${data.server.distanceMi}Mi`, true)
                 msg.edit(embed);
            });
        }
    }
};