const archieembed = require("../../util/archieembed")
const { MessageEmbed } = require("discord.js")

module.exports = {

    //Information about command
    name: "embed",
    description: "sends a embedded message",
    usage: "[text]",
    enabled: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: ["MANAGE_GUILD"],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {

        const permsError = new MessageEmbed()
            .setDescription('Error! You are missing the **MANAGE_GUILD** permission!')
            .setColor('RED')


        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(permsError)

        // Executing
        const embed = new MessageEmbed()
            .setDescription(`Please Enter your Embed Title`)
            .setFooter(`To cancel, please reply with "cancel"\nYou have 30 seconds to send your Embed Title`)
            .setColor('BLUE');
        message.channel.send(embed).then(message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 30000 }).then(collected => {
            if (typeof collected.first() === "undefined") {
                const embed = new MessageEmbed()
                    .setDescription('Timeout! Please try again later')
                    .setColor('c11515');
                message.channel.send(embed).then(message => { message.delete({ timeout: 7000 }) });
            } else {
                if (collected.first().content.toLowerCase() == 'cancel') {
                    const embed = new MessageEmbed()
                        .setDescription(`Operation Cancelled by User`)
                        .setColor('c11515');
                    message.channel.send(embed).then(message => { message.delete({ timeout: 7000 }) });
                } else {
                    const title = collected.first().content;
                    const embed = new MessageEmbed()
                        .setDescription(`Please Enter the Embed Color Hex Code`)
                        .setFooter(`To cancel, please reply with "cancel"\nYou have 30 seconds to send your Embed Color Hex Code`)
                        .setColor('BLUE');
                    message.channel.send(embed).then(message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 30000 }).then(collected2 => {
                        if (typeof collected2.first() === "undefined") {
                            const embed = new MessageEmbed()
                                .setDescription('Timeout! Please try again later')
                                .setColor('c11515');
                            message.channel.send(embed).then(message => { message.delete({ timeout: 7000 }) });
                        } else {
                            if (collected2.first().content.toLowerCase() == 'cancel') {
                                const embed = new MessageEmbed()
                                    .setDescription(`Operation Cancelled by User`)
                                    .setColor('c11515');
                                message.channel.send(embed).then(message => { message.delete({ timeout: 7000 }) });
                            } else {
                                const color = collected2.first().content;
                                const embed = new MessageEmbed()
                                    .setDescription(`Please send your Embed description`)
                                    .setFooter(`To cancel, please reply with "cancel"\nYou have 180 seconds to send your Embed Description`)
                                    .setColor('BLUE');
                                message.channel.send(embed).then(message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 180000 }).then(collected4 => {
                                    if (typeof collected4.first() === "undefined") {
                                        const embed = new MessageEmbed()
                                            .setDescription('Timeout! Please try again later')
                                            .setColor('c11515');
                                        message.channel.send(embed).then(message => { message.delete({ timeout: 7000 }) });
                                    } else {
                                        if (collected4.first().content.toLowerCase() == 'cancel') {
                                            const embed = new MessageEmbed()
                                                .setDescription(`Operation Cancelled by User`)
                                                .setColor('c11515');
                                            message.channel.send(embed).then(message => { message.delete({ timeout: 7000 }) });
                                        } else {
                                            const desc = collected4.first().content;
                                            const embed = new MessageEmbed()
                                                .setDescription(`Please send your Embed Footer`)
                                                .setFooter(`To cancel, please reply with "cancel"\nYou have 180 seconds to send your Embed Footer`)
                                                .setColor('BLUE');
                                            message.channel.send(embed).then(message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 180000 }).then(collected5 => {
                                                if (typeof collected5.first() === "undefined") {
                                                    const embed = new essageEmbed()
                                                        .setDescription('Timeout! Please try again later')
                                                        .setColor('c11515');
                                                    message.channel.send(embed).then(message => { message.delete({ timeout: 7000 }) });
                                                } else {
                                                    if (collected5.first().content.toLowerCase() == 'cancel') {
                                                        const embed = new MessageEmbed()
                                                            .setDescription(`Operation Cancelled by User`)
                                                            .setColor('c11515');
                                                        message.channel.send(embed).then(message => { message.delete({ timeout: 7000 }) });
                                                    } else {
                                                        const footer = collected5.first().content;
                                                        const embed = new MessageEmbed()
                                                            .setDescription(`Please send your mention a channel to send`)
                                                            .setFooter(`To cancel, please reply with "cancel"\nYou have 180 seconds to send the Channel ID that the embed will be sent to`)
                                                            .setColor('BLUE');
                                                        message.channel.send(embed).then(message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 180000 }).then(collected6 => {
                                                            if (typeof collected6.first() === "undefined") {
                                                                const embed = new MessageEmbed()
                                                                    .setDescription('Timeout! Please try again later')
                                                                    .setColor('c11515');
                                                                message.channel.send(embed).then(message => { message.delete({ timeout: 7000 }) });
                                                            } else {
                                                                if (collected6.first().content.toLowerCase() == 'cancel') {
                                                                    const embed = new MessageEmbed()
                                                                        .setDescription(`Operation Cancelled by User`)
                                                                        .setColor('c11515');
                                                                    message.channel.send(embed).then(message => { message.delete({ timeout: 7000 }) });
                                                                } else {
                                                                    if (collected6.first().content.includes('<#')) {
                                                                        const check = collected6.first().content.replace(/[^A-Z0-9]+/ig, "")
                                                                        if (message.guild.channels.cache.get(check)) {
                                                                            const ch = message.guild.channels.cache.get(check)
                                                                            const embed = new MessageEmbed()
                                                                                .setTitle(title)
                                                                                .setColor(color)
                                                                                .setDescription(desc)
                                                                                .setFooter(footer);
                                                                            ch.send(embed).catch((err) => {
                                                                                return message.channel.send('Unkown Error Occured. Please Check If I have permission to send in the mentioned channel')
                                                                            })
                                                                            message.channel.send(new MessageEmbed().setDescription(`Embed Has successfully sent to the mentioned channel.`).setColor("BLUE"));
                                                                            return;
                                                                        } else {
                                                                            message.channel.send('Unkown Error occured. Please check if that channel id exist. If it exists please check if I havev permission to view that channel.')
                                                                        }
                                                                    } else {
                                                                        const check = message.guild.channels.cache.get(collected6.first().content)

                                                                        if (check) {
                                                                            const ch = check
                                                                            const embed = new MessageEmbed()
                                                                                .setTitle(title)
                                                                                .setColor(color)
                                                                                .setDescription(desc)
                                                                                .setFooter(footer);
                                                                            ch.send(embed).catch((err) => {
                                                                                return message.channel.send('Unkown Error Occured. Please Check If I have permission to send in the mentioned channel')
                                                                            })
                                                                            message.channel.send(new MessageEmbed().setDescription(`Embed Has successfully sent to the mentioned channel.`).setColor("BLUE"));
                                                                            return;
                                                                        } else {
                                                                            message.channel.send('Unkown Error occured. Please check if that channel id exist. If it exists please check if I havev permission to view that channel.')
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        })).catch((err) => {
                                                            console.log(err);
                                                        });

                                                    }
                                                }
                                            })).catch((err) => {
                                                console.log(err);
                                            });
                                        }
                                    }
                                })).catch((err) => {
                                    console.log(err);
                                });
                            }
                        }
                    })).catch((err) => {
                        console.log(err);
                    });
                }
            }
        })).catch((err) => {
            console.log(err);
        });
    }
}