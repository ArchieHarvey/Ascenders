module.exports = {
    name: "unosettings",
  description: "View the current settings",
  usage: "unosettings",
  enabled: true,
  aliases: ["unoviewsettings"],
  category: "Uno",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        client.discordUNO.viewSettings(message);

    }
}