const giveawayClient = require('../../client');
const { Client, Message, MessageEmbed } = require('discord.js');
const ms = require('ms');
const { channels } = require('../../ascenders');

module.exports = {
    name: "gcurrentgiveaways",
    description: "Get a random waifu.",
    usage: "waifu",
    enabled: true,
    aliases: [],
    category: "Anime",
    memberPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {



        const curgiv = await giveawayClient.getCurrentGiveaways(true, false, message);
        console.log(curgiv)
    }
}