module.exports = {
    name: "unowinners",
  description: "View who has won the current game, if anyone has.",
  usage: "unowinners",
  enabled: true,
  aliases: ["unoviewwinners"],
  category: "Uno",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        client.discordUNO.viewWinners(message);

    }
}