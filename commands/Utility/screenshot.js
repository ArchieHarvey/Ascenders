const { Message, MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const moment = require("moment");
const fetch = require("node-fetch");

const url = require("url");


module.exports = {
    name: "ss",
    description: "Takes a screenshot of any webpage.",
    usage: "screenshot <URL>",
    enabled: false,
    aliases: ["screenshot"],
    category: "Utility",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        const user = message.author.tag
        const urls = args[0];
        if (!urls)
            return message.channel.send(`\n${user},where is the link -\n`)
                .then(m => m.delete({ timeout: 5000 }).catch(e => { }));
        if (urls.length < 8)
            return message
                .reply(
                    ":failed: https is too short to reach - 8 limit"
                )
                .then(m => m.delete({ timeout: 9000 }).catch(e => { }));

        const site = /^(https?:\/\/)/i.test(urls) ? urls : `http://${urls}`;
        try {
            const { body } = await fetch(`
        https://image.thum.io/get/width/1920/crop/675/noanimate/${site}`
            );

            return message.channel.send(
                `Here is a screenshot from requested URL`,
                {
                    files: [{ attachment: body, name: "Screenshot.png" }]
                }
            );
        } catch (err) {
            if (err.status === 404)
                return message.channel
                    .send("Could not find any results. Invalid URL?")
                    .then(m => m.delete({ timeout: 14000 }).catch(e => { }));
            return message
                .reply(`Oh no, an error occurred:. Try again later!`)
                .then(m => m.delete({ timeout: 13000 }).catch(e => { }));
        }
    }
};