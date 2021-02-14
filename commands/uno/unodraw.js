module.exports = {
    name: "unodraw",
  description: "Draws a card from the deck",
  usage: "unodraw",
  enabled: true,
  aliases: ["unodrawcard"],
  category: "Uno",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        client.discordUNO.draw(message);

    }
}