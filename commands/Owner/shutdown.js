const archieembed = require("../../util/archieembed")
const config = require('../../config.json')

module.exports = {
    name: "shutdown",
    description: "Shuts the bot down safely",
    usage: "",
    enabled: true,
    aliases: [""],
    category: "Owner",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        if (message.author.id !== config.ownerID) return archieembed("ERROR 404", message.channel)
        try {
            await message.channel.send("Bot is shutting down <a:AnimatedLoading:709735586608447488>").then(m => m.delete({ timeout: 5000 }));
            process.exit()
        } catch (e) {
            message.channel.send(`ERROR: ${e.message}`)
        }

    }
}