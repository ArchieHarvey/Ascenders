module.exports = {
    name: "unostart",
  description: "Starts an UNO game",
  usage: "unostart",
  enabled: true,
  aliases: ["unostartgame"],
  category: "Uno",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        client.discordUNO.startGame(message);

    }
}