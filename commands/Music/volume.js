const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {
	name: "volume",
  description: "To change the server song queue volume",
  usage: "",
  enabled: true,
  aliases: ["v", "vol"],
  category: "Music",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,
  
	async execute(client, message, args, data){
    const channel = message.member.voice.channel;
    if (!channel)return sendError("I'm sorry but you need to be in a voice channel to play music!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("There is nothing playing in this server.", message.channel);
    if (!args[0])return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
     if(isNaN(args[0])) return message.channel.send(':notes: Numbers only!').catch(err => console.log(err));
    if(parseInt(args[0]) > 150 ||(args[0]) < 0) return sendError('You can\'t set the volume more than 150. or lower than 0',message.channel).catch(err => console.log(err));
    serverQueue.volume = args[0]; 
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    let xd = new MessageEmbed()
    .setDescription(`I set the volume to: **${args[0]/1}/100**`)
    .setAuthor("Server Volume Manager")
    .setColor("BLUE")
    .setTimestamp()
    .setFooter("© Ascenders 2020", client.user.displayAvatarURL())
    return message.channel.send(xd);
  },
};
