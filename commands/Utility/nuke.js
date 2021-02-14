const { MessageEmbed } = require('discord.js')
const archieembed = require("../../util/archieembed")


module.exports = {
    name: "nuke",
  description: "Nukes a given channel",
  usage: "",
  enabled: true,
  aliases: [""],
  category: "Utility",
  memberPermissions: ["MANAGE_CHANNELS"],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
        if(!message.member.hasPermission("MANAGE_CHANNELS")) {
            return archieembed('You do not have the perms to use this cmd!', message.channel)
        }
        let reason = args.join(" ")// || "No Reason"
        if(!message.channel.deletable) {
            return archieembed('This channel cannot be nuked!', message.channel)
        }
        let newchannel = await message.channel.clone()
        await message.channel.delete()
        let embed = new MessageEmbed()
        .setTitle("Channel Nuked")
        .setDescription(reason)
        .setImage('https://media0.giphy.com/media/oe33xf3B50fsc/200.gif')
        await newchannel.send(embed).then(m => m.delete({timeout: 5000}));
    }
}