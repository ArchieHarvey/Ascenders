const archieembed = require('../../util/archieembed')
const { MessageEmbed, Message } = require("discord.js");

module.exports = {
    name: "rps",
    description: "play rock paper scissors with someone else",
    usage: "rps",
    enabled: true,
    aliases: [],
    category: "Games",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL", "MANAGE_CHANNELS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {
        let correctArgs = [
            'rock',
            'paper',
            'scissors'
        ]

        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0])

        let challenger = message.author

        if (!target) return message.channel.send('ERROR: Missing argument. Argument: Mention someone in this server.')
        if (target.user.bot) return message.channel.send('That is a bot.')

        let filter = m => m.author.id === target.id

        message.channel.send(`${target}, do you want to go against ${message.author} in rps?\nRespond with **y** or **n**`)
        message.channel.awaitMessages(filter, {
            max: 1,
            time: 10000,
            errors: ['time'],
        }).then(async message => {
            message = message.first()

            if (message.content.toLowerCase() === 'y') {
                const authorChannel = await message.guild.channels.create(`${challenger.username}-rps`.toLowerCase(), {
                    type: 'text',
                    permissionOverwrites: [
                        {
                            allow: 'VIEW_CHANNEL',
                            id: client.user.id
                        },
                        {
                            allow: 'VIEW_CHANNEL',
                            id: challenger.id
                        },
                        {
                            deny: 'VIEW_CHANNEL',
                            id: message.guild.id
                        },
                    ]
                })
                const targetChannel = await message.guild.channels.create(`${target.user.username}-rps`.toLowerCase(), {
                    type: 'text',
                    permissionOverwrites: [
                        {
                            allow: 'VIEW_CHANNEL',
                            id: client.user.id
                        },
                        {
                            deny: 'VIEW_CHANNEL',
                            id: message.guild.id
                        },
                        {
                            allow: 'VIEW_CHANNEL',
                            id: message.author.id
                        }
                    ]
                })
                message.channel.send(`Your channels have been created! Go check it out!\n${message.author}: Go to ${targetChannel}\n${challenger}: Go to ${authorChannel}`)

                let goFirstembed = new MessageEmbed()
                    .setAuthor(challenger.username, challenger.displayAvatarURL({ dynamic: true }))
                    .setTitle('You\'re up first!')
                    .setDescription('Choose **rock, paper, or scissors** so that the next person can go.')
                    .setColor('RANDOM')

                let waitEmbed = new MessageEmbed()
                    .setAuthor(message.member.displayName, message.member.user.displayAvatarURL({ dynamic: true }))
                    .setTitle('Waiting for second user...')
                    .setDescription('Please wait while the other player is choosing what to play.')
                    .setColor('RANDOM')

                authorChannel.send(goFirstembed)
                targetChannel.send(waitEmbed)

                let filter = m => m.author.id === challenger.id

                authorChannel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }).then(message => {
                    message = message.first()

                    if (correctArgs.includes(message.content.toLowerCase())) {
                        var challengerReponse = message.content
                        message.channel.send('Ok! Now waiting on the other user...')


                        let goFirstembed = new MessageEmbed()
                            .setAuthor(target.displayName, target.user.displayAvatarURL({ dynamic: true }))
                            .setTitle('You\'re up! The other player chose what they want!')
                            .setDescription('Choose **rock, paper, or scissors**.')
                            .setColor('RANDOM')
                        targetChannel.send(goFirstembed)


                        let filter2 = m => m.author.id === target.id

                        targetChannel.awaitMessages(filter2, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],

                        }).then(message => {
                            message = message.first()
                            if (correctArgs.includes(message.content.toLowerCase())) {
                                var targetReponse = message.content
                                message.channel.send('Ok! Getting results...').then(message => message.delete({ timeout: 5000 }))

                                let resultEmbed = new MessageEmbed()
                                    .setTitle('Here are the results!')
                                    .addField(`${challenger.username}'s choice:`, `**${challengerReponse}**`, true)
                                    .addField(`${target.user.username}'s choice:`, `**${targetReponse}**`, true)
                                    .setColor('RANDOM')

                                if (challengerReponse.toLowerCase() === 'rock' && targetReponse.toLowerCase() === 'scissors') {
                                    resultEmbed.addField(`Results:`, `**${challenger.username} wins!**`, true)
                                } else if (challengerReponse.toLowerCase() === 'scissors' && targetReponse.toLowerCase() === 'paper') {
                                    resultEmbed.addField(`Results:`, `**${challenger.username} wins!**`, true)
                                } else if (challengerReponse.toLowerCase() === 'paper' && targetReponse.toLowerCase() === 'rock') {
                                    resultEmbed.addField(`Results:`, `**${challenger.username} wins!**`, true)
                                } else if (challengerReponse.toLowerCase() === 'scissors' && targetReponse.toLowerCase() === 'rock') {
                                    resultEmbed.addField(`Results:`, `**${target.user.username} wins!**`, true)
                                } else if (challengerReponse.toLowerCase() === 'paper' && targetReponse.toLowerCase() === 'scissors') {
                                    resultEmbed.addField(`Results:`, `**${target.user.username} wins!**`, true)
                                } else if (challengerReponse.toLowerCase() === 'rock' && targetReponse.toLowerCase() === 'paper') {
                                    resultEmbed.addField(`Results:`, `**${target.user.username} wins!**`, true)
                                } else if (challengerReponse.toLowerCase() === targetReponse.toLowerCase()) {
                                    resultEmbed.addField(`Results:`, `**Tie; No one wins!**`, true)
                                }

                                setTimeout(() => {
                                    targetChannel.send(resultEmbed)
                                    authorChannel.send(resultEmbed)

                                }, 5000)

                                setTimeout(() => {
                                    let gg = 'GG guys. Ending game..'
                                    targetChannel.send(gg)
                                    authorChannel.send(gg)
                                }, 15000)

                                setTimeout(() => {
                                    targetChannel.delete()
                                    authorChannel.delete()
                                }, 20000)
                            } else {
                                let errorMessage = 'Game has ended due to incorrect choice.'

                                targetChannel.send(errorMessage)
                                authorChannel.send(errorMessage)

                                setTimeout(() => {
                                    targetChannel.delete()
                                    authorChannel.delete()
                                }, 5000)
                            }


                        }).catch(collected => {
                            let errorMessage = 'Game has ended due to inactivity. GG.'

                            targetChannel.send(errorMessage)
                            authorChannel.send(errorMessage)

                            setTimeout(() => {
                                targetChannel.delete()
                                authorChannel.delete()
                            }, 5000)
                        })
                    } else {
                        let errorMessage = 'Game has ended due to incorrect choice.'

                        targetChannel.send(errorMessage)
                        authorChannel.send(errorMessage)

                        setTimeout(() => {
                            targetChannel.delete()
                            authorChannel.delete()
                        }, 5000)
                    }


                }).catch(collected => {
                    let errorMessage = 'Game has ended due to inactivity. GG.'

                    targetChannel.send(errorMessage)
                    authorChannel.send(errorMessage)

                    setTimeout(() => {
                        targetChannel.delete()
                        authorChannel.delete()
                    }, 5000)
                })


            } else if (message.content.toLowerCase() === 'n') {
                message.channel.send(`${message.author} has turned down the challenge.`)
            } else {
                message.channel.send('Invalid response.')
            }
        })
    }
}