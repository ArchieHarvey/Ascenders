const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/error");

module.exports = {
    name: "leave",
  description: "Leaves The Voice Channel!",
  usage: "",
  enabled: true,
  aliases: ["goaway", "disconnect", "dc"],
  category: "Music",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,
  
    async execute(client, message, args, data){
        let channel = message.member.voice.channel;
        if (!channel) return sendError("I'm sorry but you need to be in a voice channel!", message.channel);
        if (!message.guild.me.voice.channel) return sendError("I Am Not In Any Voice Channel!", message.channel);

        try {
            await message.guild.me.voice.channel.leave();
        } catch (error) {
            await message.guild.me.voice.kick(message.guild.me.id);
            return sendError("Trying To Leave The Voice Channel...", message.channel);
        }

        const Embed = new MessageEmbed()
            .setAuthor("Leave Voice Channel")
            .setColor("GREEN")
            .setTitle("Success")
            .setDescription("🎶 Left The Voice Channel.")
            .setTimestamp()
            .setFooter("© Ascenders 2020", client.user.displayAvatarURL())

        return message.channel.send(Embed).catch(() => message.channel.send("🎶 Left The Voice Channel :C"));
    },
};