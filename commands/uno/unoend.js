module.exports = {
    name: "unoend",
  description: "Ends an UNO game",
  usage: "unoend",
  enabled: true,
  aliases: ["unoendgame"],
  category: "Uno",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        client.discordUNO.endGame(message);

    }
}