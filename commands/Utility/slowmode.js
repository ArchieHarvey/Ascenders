const archieembed = require("../../util/archieembed")

module.exports = {
    name: "slowmode",
  description: "Set the slowmode of a channel.",
  usage: "slowmode [seconds]",
  enabled: true,
  aliases: [""],
  category: "Utility",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        if(!message.member.hasPermission("MANAGE_CHANNELS")) {
            return archieembed("You don't have enough perms to use this command!", message.channel)
        }
        let duration = args[0]
        if(isNaN(duration)) return archieembed(`Please give the time in seconds.\n\nCommand Usage Example: \`${data.guild.prefix}slowmode 10\`\nTo remove slowmode use \`${data.guild.prefix}slowmode 0\` `, message.channel)
        
        message.channel.setRateLimitPerUser(duration)
        return archieembed(`Successfully set the slowmode to ${duration} seconds`, message.channel)
    }
}