module.exports = {
    name: "unojoin",
  description: "Join an UNO game",
  usage: "unojoin",
  enabled: true,
  aliases: ["unojoingame"],
  category: "Uno",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        client.discordUNO.addUser(message);

    }
}