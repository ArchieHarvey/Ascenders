module.exports = {
    name: "unotable",
  description: "View the current table",
  usage: "unotable",
  enabled: true,
  aliases: ["unoviewtable"],
  category: "Uno",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        client.discordUNO.viewTable(message);

    }
}