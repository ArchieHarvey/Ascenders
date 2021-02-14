module.exports = {
    name: "unohand",
  description: "View your current hand.",
  usage: "unohand",
  enabled: true,
  aliases: ["unoviewcards"],
  category: "Uno",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        client.discordUNO.viewCards(message);

    }
}