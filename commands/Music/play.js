const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { getTracks, getPreview } = require("spotify-url-info")
module.exports = {
	name: "play",
  description: "To play songs :D",
  usage: "<YouTube Playlist URL | Playlist Name>",
  enabled: true,
  aliases: ["pl"],
  category: "Music",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,
  
	async execute(client, message, args, data){
    try{
      let text = args.join(" ")
      const { channel } = message.member.voice; // { message: { member: { voice: { channel: { name: "Allgemein", members: [{user: {"username"}, {user: {"username"}] }}}}}
      if(!channel)
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter("Requested by "+message.author.tag + " | Music Module", message.author.displayAvatarURL({ dynamic: true }))
          .setDescription(`<:denied:811890796806406174> **You have to be in a voice channel to play music.**`)
        );
      if(client.distube.getQueue(message) && channel.id !== message.guild.me.voice.channel.id)
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter("Requested by "+message.author.tag + " | Music Module", message.author.displayAvatarURL({ dynamic: true }))
          .setDescription(`<:denied:811890796806406174> **You need to be in the same voice channel as me. \nChannel: \`${message.guild.me.voice.channel.name}\`**`)
        );
      if(!args[0])
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter("Requested by "+message.author.tag + " | Music Module", message.author.displayAvatarURL({ dynamic: true }))
          .setDescription(`<:denied:811890796806406174> What do you want to play.\nUsage: \`${data.guild.prefix}play <name/URL>\``)
        );
      message.channel.send(`:mag: Searching for ${text}`).then(msg=>msg.delete({timeout: 3000}).catch(e=>console.log(e.message)))
      //https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas
      if(args.join(" ").toLowerCase().includes("spotify") && args.join(" ").toLowerCase().includes("track")){
        getPreview(args.join(" ")).then(result => {
          client.distube.play(message, result.title);
        })
      }
      else if(args.join(" ").toLowerCase().includes("spotify") && args.join(" ").toLowerCase().includes("playlist")){
        getTracks(args.join(" ")).then(result => {
          for(const song of result)
          client.distube.play(message, song.name);
        })
      }
      else {
        client.distube.play(message, text);
      }
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setDescription(`<:denied:811890796806406174> | An error occurred`)
        );
    }
  }
}