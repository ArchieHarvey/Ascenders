const giveawayClient = require('../../client');
const { Client, Message, MessageEmbed } = require('discord.js');
const ms = require('ms');
const { channels } = require('../../ascenders');

module.exports = {
    name: "greroll",
    description: "rerolls giveaway",
    usage: "",
    enabled: true,
    aliases: [],
    category: "",
    memberPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
            return message.channel.send(':x: You need to have the manage messages permissions to reroll giveaways.');
        }
    
        // If no message ID or giveaway name is specified
        if(!args[0]){
            return message.channel.send(':x: You have to specify a valid message ID!');
        }
    
        // try to found the giveaway with prize then with ID
        let giveaway = 
        // Search with giveaway prize
        client.giveaways.giveaways.find((g) => g.prize === args.join(' ')) ||
        // Search with giveaway ID
        client.giveaways.giveaways.find((g) => g.messageID === args[0]);
    
        // If no giveaway was found
        if(!giveaway){
            return message.channel.send('Unable to find a giveaway for `'+ args.join(' ') +'`.');
        }
    
        // Reroll the giveaway
        client.giveaways.reroll(giveaway.messageID)
        .then(() => {
            // Success message
            message.channel.send('Giveaway rerolled!');
        })
        .catch((e) => {
            if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)){
                message.channel.send('This giveaway is not ended!');
            } else {
                console.error(e);
                message.channel.send('An error occured...');
            }
        });
    }
}