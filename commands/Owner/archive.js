const sa = require('superagent')

module.exports = {
  name: "archive",
  description: "Sends the IP of the server",
  usage: "",
  enabled: true,
  aliases: [""],
  category: "Owner",
  memberPermissions: [],
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  //Settings for command
  nsfw: false,
  ownerOnly: true,
  cooldown: 0,

  async execute(client, message, args, data) {
    if (!args || isNaN(args)) return message.channel.send('That isn\'t a valid suffix! Please provide any number between 5 and 1000 (10,000 if Patreon).')
    const num = parseInt(args)
    if (num < 5 || num > 1000) return message.channel.send('That number is invalid! Please provide any number between 5 and 1000 (10,000 if Patreon)')
    message.channel.message.fetch(num).then(messages => {
      const pasteString = messages.reverse().map(m => `${m.author.username}#${m.author.discriminator} (${m.author.id}) | (${m.author.avatarURL}) | ${new Date(m.timestamp)}: ${m.content ? m.content : ''} | ${m.embeds.length === 0 ? '' : `{"embeds": [${m.embeds.map(e => JSON.stringify(e))}]}`} | ${m.attachments.length === 0 ? '' : ` =====> Attachment: ${m.attachments[0].filename}:${m.attachments[0].url}`}`).join('\r\n')
      sa
        .post(process.env.PASTE_CREATE_ENDPOINT)
        .set('Authorization', process.env.PASTE_CREATE_TOKEN)
        .set('Content-Type', 'text/plain')
        .send(pasteString || 'No messages were able to be archived')
        .end((err, res) => {
          if (!err && res.statusCode === 200 && res.body.key) {
            message.channel.send(`<@${message.author.id}>, **${messages.length}** message(s) could be archived. Link: https://haste.lemonmc.com/${res.body.key}.txt`)
          } else {
            global.logger.error(err, res.body)
            global.webhook.error('An error has occurred while posting to the paste website. Check logs for more.')
          }
        })
    })
  }
}
