module.exports = {
    name: "unoleave",
  description: "Leaves an UNO game",
  usage: "unoleave",
  enabled: true,
  aliases: ["unoleavegame"],
  category: "Uno",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        client.discordUNO.removeUser(message);

    }
}