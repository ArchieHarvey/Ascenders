

module.exports = {

    //Information about command
    name: "delete",
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

        if (!args[0]) return message.reply('Please enter the amount of messages you want to clear!');
        if (isNaN(args[0])) return message.reply('Please enter a real number!');

        if (args[0] > 500) return message.reply('You cannot delete more than 500 messages!');
        if (args[0] < 1) return message.reply('To delete messages please delete atleast 1 message.');

        await message.channel.messages.fetch({ limit: args[0] }).then(messages => {

            message.channel.bulkDelete(messages);
        });
    }

}