module.exports = {
    name: "sanitize",
    description: "sanitizes the channel",
    usage: "sanitizing",
    enabled: true,
    aliases: [],
    category: "Fun",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        message.channel
            .send("Starting sanatization process <:mask:803972838515539968>")
            .then((msg) => {
                setTimeout(() => {
                    msg.edit("Disinfecting the channel 🧼🧴");
                }, 3000);
                setTimeout(() => {
                    msg.edit("Cleaning pfps 🧼🧴");
                }, 6000);
                setTimeout(() => {
                    msg.edit("Sanatizing words 🧼📝");
                }, 9000);
                setTimeout(() => {
                    msg.edit("Killing all germs 🦠🔫");
                }, 12000);
                setTimeout(() => {
                    msg.edit("This channel is sanatized! \nHave a nice day!");
                }, 15000);
            });
    }
}