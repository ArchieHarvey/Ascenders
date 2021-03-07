const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');

module.exports = {
  name: "servers",
  description: "list of servers",
  usage: "servers",
  enabled: true,
  aliases: [],
  category: "Owner",
  memberPermissions: [],
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  //Settings for command
  nsfw: false,
  ownerOnly: true,
  cooldown: 0,

  async execute(client, message, args, data) {
    message.channel.send(`= Servers [${client.guilds.cache.size}] = \n${client.guilds.cache.map(g => `${g.id}  -  ${g.name}  -  [Members: ${g.memberCount}]`).join('\n')}`, { code: 'asciidoc', split: { char: '\u200b' } });

  }
}