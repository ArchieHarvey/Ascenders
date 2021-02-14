module.exports = {
    name: "usettings",
  description: "Update the channels game settings",
  usage: "usettings",
  enabled: true,
  aliases: ["unoupdatesettings"],
  category: "Uno",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        client.discordUNO.updateSettings(message);

    }
}