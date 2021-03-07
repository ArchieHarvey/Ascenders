const { MessageEmbed } = require('discord.js');
const archieembed = require("../../util/archieembed")

module.exports = {
    name: "eval",
    description: "Sends the IP of the server",
    usage: "",
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
    const input = args.join(' ');
    if (!input) return archieembed('Please provide code to eval', message.channel);
    if(!input.toLowerCase().includes('token')) {

      const embed = new MessageEmbed();

      try {
        let output = eval(input);
        if (typeof output !== 'string') output = require('util').inspect(output, { depth: 0 });
        
        embed
          .addField('Input', `\`\`\`js\n${input.length > 1024 ? 'Too large to display.' : input}\`\`\``)
          .addField('Output', `\`\`\`js\n${output.length > 1024 ? 'Too large to display.' : output}\`\`\``)
          .setColor('#66FF00');

      } catch(err) {
        embed
          .addField('Input', `\`\`\`js\n${input.length > 1024 ? 'Too large to display.' : input}\`\`\``)
          .addField('Output', `\`\`\`js\n${err.length > 1024 ? 'Too large to display.' : err}\`\`\``)
          .setColor('#FF0000');
      }

      message.channel.send(embed);

    } else {
      message.channel.send('(╯°□°)╯︵ ┻━┻ MY token. **MINE**.');
    }
  }
};