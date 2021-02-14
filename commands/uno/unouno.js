module.exports = {
    name: "unocall",
  description: "Protect yourself from callouts or call someone else out",
  usage: "unocall",
  enabled: true,
  aliases: ["unouno"],
  category: "Uno",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        client.discordUNO.UNO(message);

    }
}