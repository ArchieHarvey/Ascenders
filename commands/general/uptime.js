const { MessageEmbed } = require('discord.js')
const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
    //Command Information
    name: "uptime",
    description: "To see bots uptime",
    usage: "uptime",
    enabled: true,
    aliases: [],
    category: "General",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {

        const d = moment.duration(message.client.uptime);
        const days = (d.days() == 1) ? `${d.days()} day` : `${d.days()} days`;
        const hours = (d.hours() == 1) ? `${d.hours()} hour` : `${d.hours()} hours`;
        const minutes = (d.minutes() == 1) ? `${d.minutes()} minute` : `${d.minutes()} minutes`;
        const seconds = (d.seconds() == 1) ? `${d.seconds()} second` : `${d.seconds()} seconds`;
        const date = moment().subtract(d, 'ms').format('dddd, MMMM Do YYYY, hh:mm:ss Z');
        const embed = new MessageEmbed()
            .setTitle('Ascender\'s Uptime')
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`\`\`\`\n${days}, ${hours}, ${minutes}, and ${seconds}\`\`\``)
            .addField('Last Restart', `\`\`\`\n${date}\`\`\``)
            .setFooter(`© Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);


    }
};