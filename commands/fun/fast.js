const Discord = require('discord.js')
const txtgen = require('txtgen')
const ms = require('ms')
const inGame = new Set()
const archieembed = require("../../util/archieembed")

module.exports = {

    //Information about command
    name: "fast",
    description: "fast typing",
    usage: "fast",
    enabled: true,
    aliases: [],
    category: "Fun",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {
        const filter = m => m.author.id === message.author.id
        if (inGame.has(message.author.id)) return
        inGame.add(message.author.id)
        for (i = 0; i < 5; i++) {
            const time = Date.now()
            let sentence = ''
            let ogSentence = txtgen.sentence().toLowerCase().split('.').join('').split(',').join('')
            ogSentence.split(' ').forEach(argument => {
                sentence += '`' + argument.split('').join(' ') + '` '
            })
            message.reply(`**Write the following message (You have 60 seconds!)**:\n${sentence}`)
            try {
                msg = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 60000,
                    errors: ['time']
                })
            } catch (ex) {
                archieembed(`<@${message.author.id}> **Time\'s up!**`, message.channel)
                inGame.delete(message.author.id)
                break
            }
            if (['cancel', 'end'].includes(msg.first().content.toLowerCase().trim())) {
                archieembed(`<@${message.author.id}> **The game ended!**`, message.channel)
                inGame.delete(message.author.id)
                break
            } else if (msg.first().content.toLowerCase().trim() === ogSentence.toLowerCase()) {
                archieembed(`<@${message.author.id}> **Good job!\nIt took you ${ms(Date.now() - time, { long: true })} to type it!**`, message.channel)
            } else {
                archieembed(`<@${message.author.id}> **You failed the game.**`, message.channel)
                inGame.delete(message.author.id)
                break
            }

            if (i === 5) {
                archieembed(`<@${message.author.id}> You won :)`, message.channel)
                inGame.delete(message.author.id)
                break
            }
        }
    }
}