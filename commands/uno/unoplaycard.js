module.exports = {
    name: "unoplay",
  description: "Play a card",
  usage: "unoplay",
  enabled: true,
  aliases: ["unoplaycard"],
  category: "Uno",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        client.discordUNO.playCard(message);

    }
}