module.exports = {
    name: "unocreate",
  description: "Create a new UNO game",
  usage: "unocreate",
  enabled: true,
  aliases: ["unocreategame"],
  category: "Uno",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        client.discordUNO.createGame(message);

    }
}