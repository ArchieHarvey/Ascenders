const ms = require('ms');

module.exports = {
    name: "gedit",
    description: "ends giveaway",
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

        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(':x: You need to have the manage messages permissions to reroll giveaways.')
        let messageID = args[1];
        let giveawayDuration = args[2];
        if (!giveawayDuration) return message.channel.send('Pleae provide a valid duration | ex: !gedit {messageid} 30s 3 nitro');
        
        let giveawayWinners = args[3];

        if (!giveawayWinners) return message.channel.send('Please provide a valid number of winners! | ex: !gedit {messageid} 30s 3 nitro')
        
        let giveawayPrize = args.slice(4).join(" ");
        
        if (!messageID) message.channel.send('Please provide a message ID.')

        client.giveaways.edit(messageID, {
            newWinnerCount: giveawayWinners,
            newPrize: giveawayPrize,
            addTime: ms(giveawayDuration)
        }).then(() => {
            message.channel.send("Success! Giveaway will updated very soon.");
        }).catch((_err) => {
            message.channel.send("No giveaway found for " + messageID + ", please check and try again");
        });
    }
}