const Discord = require("discord.js");
const fs = require("fs");
const Guild = require("./models/log");
const mongoose = require("mongoose");

module.exports = c => {
    console.log("Loaded Logger Module");
    try {
        c.on("channelCreate", function (channel) {
            send_log(
                c,
                channel.guild,
                "GREEN",
                "Channel CREATED",
                `ChannelNAME: \`${channel.name}\`\nChannelID: \`${channel.id}\`\nChannelTYPE: \`${channel.type}\``
            );
        });
        c.on("channelDelete", function (channel) {
            send_log(
                c,
                channel.guild,
                "RED",
                "Channel DELETED",
                `ChannelNAME: \`${channel.name}\`\nChannelID: \`${channel.id}\`\nChannelTYPE: \`${channel.type}\``
            );
        });
        c.on("channelPinsUpdate", function (channel, time) {
            send_log(
                c,
                channel.guild,
                "YELLOW",
                "Channel PINS UPDATE",
                `ChannelNAME: \`${channel.name}\`\nChannelID: \`${channel.id}\`\nPinned at \`${time}\``,
                "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/samsung/265/pushpin_1f4cc.png"
            );
        });
        c.on("channelUpdate", function (oldChannel, newChannel) {
            let newCat = newChannel.parent ? newChannel.parent.name : "NO PARENT";
            let guildChannel = newChannel.guild;
            if (!guildChannel || !guildChannel.available) return;

            let types = {
                text: "Text Channel",
                voice: "Voice Channel",
                null: "No Type",
                news: "News Channel",
                store: "Store Channel",
                category: "Category"
            };

            if (oldChannel.name != newChannel.name) {
                send_log(
                    c,
                    oldChannel.guild,
                    "YELLOW",
                    "Channel UPDATED - NAME",
                    `ChannelNAME: \`${oldChannel.name}\`\nChannelID: \`${oldChannel.id}\`\n\n` +
                    `ChannelNAME: \`${newChannel.name}\`\nChannelID: \`${newChannel.id}\``
                );
            } else if (oldChannel.type != newChannel.type) {
                send_log(
                    c,
                    oldChannel.guild,
                    "YELLOW",
                    "Channel UPDATED - TYPE",
                    `ChannelNAME: \`${oldChannel.name}\`\nChannelID: \`${oldChannel.id
                    }\`\nChannelTYPE: \`${types[oldChannel.type]}\`\n\n` +
                    `ChannelNAME: \`${newChannel.name}\`\nChannelID: \`${newChannel.id
                    }\`\nChannelTYPE: \`${types[newChannel.type]}\``
                );
            } else if (oldChannel.topic != newChannel.topic) {
                send_log(
                    c,
                    oldChannel.guild,
                    "YELLOW",
                    "Channel UPDATED - TOPIC",
                    `ChannelNAME: \`${oldChannel.name}\`\nChannelID: \`${oldChannel.id}\`\nChannelTOPIC: \`${oldChannel.topic}\`\n\n` +
                    `ChannelNAME: \`${newChannel.name}\`\nChannelID: \`${newChannel.id}\`\nChannelTOPIC: \`${newChannel.topic}\``
                );
            }
        });
        c.on("emojiCreate", function (emoji) {
            send_log(
                c,
                emoji.guild,
                "GREEN",
                "EMOJI CREATED",
                `EMOJI: ${emoji}\nEMOJINAME: ${emoji.name}\nEMOJIID: ${emoji.id}\nEMOJIURL: ${emoji.url}`
            );
        });

        c.on("emojiDelete", function (emoji) {
            send_log(
                c,
                emoji.guild,
                "RED",
                "EMOJI DELETED",
                `EMOJI: ${emoji}\nEMOJINAME: ${emoji.name}\nEMOJIID: ${emoji.id}\nEMOJIURL: ${emoji.url}`
            );
        });

        c.on("emojiUpdate", function (oldEmoji, newEmoji) {
            if (oldEmoji.name !== newEmoji.name) {
                send_log(
                    c,
                    oldEmoji.guild,
                    "ORANGE",
                    "EMOJI NAME CHANGED",
                    `__Emoji: ${newEmoji}__ \n\n**Before:** \`${oldEmoji.name}\`\n**After:** \`${newEmoji.name}\`\n**Emoji ID:** \`${newEmoji.id}\``
                );
            }
        });

        c.on("guildBanAdd", function (guild, user) {
            send_log(
                c,
                guild,
                "RED",
                "USER BANNED",
                `User: ${user} (\`${user.id}\`)\n\`${user.tag}\``,
                user.user.displayAvatarURL({ dynamic: true })
            );
        });

        c.on("guildBanRemove", function (guild, user) {
            send_log(
                c,
                guild,
                "YELLOW",
                "USER UNBANNED",
                `User: ${user} (\`${user.id}\`)\n\`${user.tag}\``,
                user.user.displayAvatarURL({ dynamic: true })
            );
        });

        c.on("guildMemberAdd", function (member) {
            send_log(
                member.guild,
                c,
                "GREEN",
                "MEMBER JOINED",
                `Member: ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\``,
                member.user.displayAvatarURL({ dynamic: true })
            );
        });

        c.on("guildMemberRemove", function (member) {
            send_log(
                c,
                member.guild,
                "RED",
                "MEMBER LEFT",
                `Member: ${member.user} (\`${member.user.id}\`)\n\`${member.user.tag}\``,
                member.user.displayAvatarURL({ dynamic: true })
            );
        });

        c.on("guildMembersChunk", function (members, guild) {
            send_log(
                guild,
                c,
                "RED",
                "MEMBER CHUNK / RAID - " + members.length + " Members",
                members.map(
                    (user, index) => `${index}) - ${user} - ${user.tag} - \`${user.id}\``
                )
            );
        });

        c.on("guildMemberUpdate", function (oldMember, newMember) {
            let options = {};

            if (options[newMember.guild.id]) {
                options = options[newMember.guild.id];
            }

            // Add default empty list
            if (typeof options.excludedroles === "undefined")
                options.excludedroles = new Array([]);
            if (typeof options.trackroles === "undefined") options.trackroles = true;
            const oldMemberRoles = oldMember.roles.cache.keyArray();
            const newMemberRoles = newMember.roles.cache.keyArray();
            const oldRoles = oldMemberRoles
                .filter(x => !options.excludedroles.includes(x))
                .filter(x => !newMemberRoles.includes(x));
            const newRoles = newMemberRoles
                .filter(x => !options.excludedroles.includes(x))
                .filter(x => !oldMemberRoles.includes(x));
            const rolechanged = newRoles.length || oldRoles.length;

            if (rolechanged) {
                let roleadded = "";
                if (newRoles.length > 0) {
                    for (let i = 0; i < newRoles.length; i++) {
                        if (i > 0) roleadded += ", ";
                        roleadded += `<@&${newRoles[i]}>`;
                    }
                }
                let roleremoved = "";
                if (oldRoles.length > 0) {
                    for (let i = 0; i < oldRoles.length; i++) {
                        if (i > 0) roleremoved += ", ";
                        roleremoved += `<@&${oldRoles[i]}>`;
                    }
                }
                let text = `${roleremoved ? `❌ ROLE REMOVED: \n${roleremoved}` : ""}${roleadded ? `✅ ROLE ADDED:\n${roleadded}` : ""
                    }`;
                send_log(
                    c,
                    oldMember.guild,
                    `${roleadded ? "GREEN" : "RED"}`,
                    "Member ROLES Changed",
                    `Member: ${newMember.user}\nUser: \`${oldMember.user.tag}\`\n\n${text}`
                );
            }
        });

        c.on("messageDelete", function (message) {
            if (message.author.bot) return;

            if (message.channel.type !== "text") return;

            send_log(
                c,
                message.guild,
                "ORANGE",
                "Message Deleted",
                `
**Author : ** <@${message.author.id}> - *${message.author.tag}*
**Date : ** ${message.createdAt}
**Channel : ** <#${message.channel.id}> - *${message.channel.name}*
**Deleted Message : **
\`\`\`
${message.content.replace(/`/g, "'")}
\`\`\`
**Attachment URL : **
${message.attachments.map(x => x.proxyURL)}
`
            );
        });

        c.on("messageDeleteBulk", function (messages) {
            send_log(
                c,
                messages.guild,
                "RED",
                messages.length + "  Message Deleted BULK",
                `${messages.length} Messages delete in: ${messages.channel}`
            );
        });

        c.on("messageUpdate", function (oldMessage, newMessage) {
            if (oldMessage.author.bot) return;

            if (oldMessage.channel.type !== "text") return;
            if (newMessage.channel.type !== "text") return;

            if (oldMessage.content === newMessage.content) return;
            send_log(
                c,
                oldMessage.guild,
                "YELLOW",
                "Message UPDATED",
                `
**Author : ** <@${newMessage.member.user.id}> - *${newMessage.member.user.tag}*
**Date : ** ${newMessage.createdAt}
**Channel : ** <#${newMessage.channel.id}> - *${newMessage.channel.name}*
**Orignal Message : **
\`\`\`
${oldMessage.content.replace(/`/g, "'")}
\`\`\`
**Updated Message : **
\`\`\`
${newMessage.content.replace(/`/g, "'")}
\`\`\``
            );
        });

        c.on("roleCreate", function (role) {
            send_log(
                c,
                role.guild,
                "GREEN",
                "ROLE CREATED"`ROLE: ${role}\nROLENAME: ${role.name}\nROLEID: ${role.id}\nHEXCOLOR: ${role.hexColor}\nPOSITION: ${role.position}`
            );
        });

        c.on("roleDelete", function (role) {
            send_log(
                c,
                role.guild,
                "RED",
                "ROLE DELETED"`ROLE: ${role}\nROLENAME: ${role.name}\nROLEID: ${role.id}\nHEXCOLOR: ${role.hexColor}\nPOSITION: ${role.position}`
            );
        });



        c.on("userUpdate", function (oldUser, newUser) {
            if (oldUser.username !== newUser.username) {
                send_log(
                    newUser.guild,
                    c,
                    "BLACK",
                    "Member Username Changed",
                    `Member: ${newUser}\nOld Username: \`${oldUser.username}\`\nNew Username: \`${newUser.username}\` `
                );
            }
        });
    } catch (e) {
        console.log(String(e.stack).yellow);
    }
};

async function send_log(c, guild, color, title, description, thumb) {
    try {
        //CREATE THE EMBED
        const LogEmbed = new Discord.MessageEmbed()
            .setColor(color ? color : "BLACK")
            .setDescription(description ? description.substr(0, 2048) : "\u200b")
            .setTitle(title ? title.substr(0, 256) : "\u200b")
            .setTimestamp()
            .setThumbnail(thumb ? thumb : guild.iconURL({ format: "png" }))
            .setFooter(
                guild.name + " | powered by: milrato.eu & Modified by ShinchanOP",
                guild.iconURL({ format: "png" })
            );
        //GET THE CHANNEL
        const guilddb = await Guild.findOne(
            {
                guildID: guild.id
            },
            (err, guild) => {
                if (err) console.error(err);
            }
        );
        if (!guilddb) return;
        const ch = guilddb.logChannelID;
        const logger = await c.channels.fetch(ch);
        if (!logger) throw new SyntaxError("CHANNEL NOT FOUND");

        try {
            const hook = new Discord.WebhookClient(
                guilddb.webhookid,
                guilddb.webhooktoken
            );
            hook.send({
                username: guild.name,
                avatarURL: guild.iconURL({ format: "png" }),
                embeds: [LogEmbed]
            });
        } catch {
            return;
        }
    } catch (e) {
        console.log(e);
    }
}