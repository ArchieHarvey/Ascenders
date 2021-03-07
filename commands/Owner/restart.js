const archieembed = require("../../util/archieembed")
const config = require('../../config.json')

module.exports = {
    name: "restart",
    description: "Restarts the bot!",
    usage: "",
    enabled: true,
    aliases: [],
    category: "Owner",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: true,
    cooldown: 0,

    async execute(client, message, args, data) {
        if (message.author.id !== config.ownerID) {
            return archieembed("Only the bot owner may use this command!", message.channel)
        }
        await archieembed("Restarting bot! <a:loading:814137977461801020>", message.channel)
        process.exit()
    }
}