const { Client, Message, MessageEmbed } = require("discord.js");
const archieembed = require("../../util/archieembed");
const { oneLine, stripIndent } = require('common-tags');

module.exports = {

  //Information about command
  name: "nickname",
  description: "Changes nickname",
  usage: "<@user>",
  enabled: true,
  aliases: [],
  category: "Moderation",
  memberPermissions: ["MANAGE_NICKNAMES"],
  botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_NICKNAMES'],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

  //Execute to command once the settings have been checked
  async execute(client, message, args, data) {

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    if (!member) return message.reply("Please specify a member!");

    if (member.roles.highest.position >= message.member.roles.highest.position && member != message.member)
      return archieembed(stripIndent`
      You cannot change the nickname of someone with an equal or higher role
    `, message.channel);

    if (!args[1]) return archieembed('Please provide a nickname', message.channel);
    const nickname = args.slice(1).join(" ")
      if (!nickname.replace(/\s/g, '').length) return archieembed('Please provide a nickname', message.channel);
    

    if (nickname.length > 32) {
      return archieembed('Please ensure the nickname is no larger than 32 characters', message.channel);

    } else {

      let reason;
      if (args[1].startsWith('"'))
        reason = message.content.slice(message.content.indexOf(nickname) + nickname.length + 1);
      else reason = message.content.slice(message.content.indexOf(nickname) + nickname.length);
      if (!reason) reason = '`None`';
      if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

      try {

        // Change nickname
        const oldNickname = member.nickname || '`None`';
        const nicknameStatus = `${oldNickname} ➔ ${nickname}`;
        await member.setNickname(nickname);
        const embed = new MessageEmbed()
          .setTitle('Set Nickname')
          .setDescription(`${member}'s nickname was successfully updated.`)
          .addField('Moderator', message.member, true)
          .addField('Member', member, true)
          .addField('Nickname', nicknameStatus, true)
          .addField('Reason', reason)
          .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        message.channel.send(embed);
      } catch (err) {
        message.client.logger.error(err.stack);
        archieembed(`\`Please check the role hierarchy\` ${err.message}`, message.channel);
      }
    }
  }
};