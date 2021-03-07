module.exports = {
    name: "unoclose",
  description: "Closes an UNO game",
  usage: "unoclose",
  enabled: true,
  aliases: ["unoclosegame"],
  category: "Uno",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        client.discordUNO.closeGame(message);

    }
}