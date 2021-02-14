const ms = require('ms')
const Discord = require('discord.js')


module.exports = {
    name: "remind",
  description: "Reminder",
  usage: "[]",
  enabled: false,
  aliases: [],
  category: "Utility",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){

    // Variables
    let reason = args.slice(1).join(" ")
    let time = args[0];

        // Input Checking
        const tempMuteFormatErr = new Discord.MessageEmbed()
          .setDescription(`Error! You must state a duration for your reminder!. \`${data.guild.prefix}remind [time] [reason]\``)
          .setColor('RED')
        if (!time) return message.channel.send(tempMuteFormatErr)

        const noReasonInput = new Discord.MessageEmbed()
          .setDescription(`Error! Please state your remind reason! \`${data.guild.prefix}remind [time] [reason]\``)
          .setColor('RED')
        if (!reason) return message.channel.send(noReasonInput)

        // Executing
        const muteEmbedServer = new Discord.MessageEmbed()
          .setAuthor('| Reminder Set!', message.author.displayAvatarURL())
          .setDescription(`Successfully Set ${message.author.tag}'s reminder!`)
          .addField('❯ Remind You In:', `${time}`)
          .addField('❯ Remind Reason', `${reason}`)
          .setColor('BLUE')
          .setTimestamp()
          .setFooter('Successfully Reminded The Command Author!')

        message.channel.send(muteEmbedServer)
        console.log(`${message.author.tag}'s Reminder has started! Reminding him/her in ${time}`)

        setTimeout(async function () {
          console.log(`${message.author.tag}'s Reminder has finished! I've successfullying reminded him!`)

          message.channel.send(`<@${message.author.id}> Here is your reminder!`)
          const reminderEmbed = new Discord.MessageEmbed()
            .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
            .setDescription(`${message.author.tag} Here is your reminder!`)
            .setColor('BLUE')
            .addField('❯ Remind Reason', `${reason}`)
            .setTimestamp()
            .setFooter('Successfully Reminded The Command Author!')

          message.channel.send(reminderEmbed)


        }, ms(time));
      }
    }