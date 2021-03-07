const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "help",
    description: "Help Menu",
    usage: "help [module]",
    enabled: false,
    aliases: [],
    category: "Utility",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    async execute(client, message, args, data) {

        if (!args[0]) {
            const help = new MessageEmbed()
                .setAuthor("Help Module | Beta Phase")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **\n\nTo check out a category, use command \`${data.guild.prefix}help [category name]\``)
                .addField(':hammer: Configuration', `**\`${data.guild.prefix}help configuration\`**`, true)
                .addField(':question: General', `**\`${data.guild.prefix}help general\`**`, true)
                .addField(':gear: Moderation', `**\`${data.guild.prefix}help moderation\`**`, true)
                .addField(':musical_note: Music', `**\`${data.guild.prefix}help music\`**`, true)
                .addField(':tools: Utility', `**\`${data.guild.prefix}help utility\`**`, true)
                .addField(':gift: Giveaway', `**\`${data.guild.prefix}help giveaway\`**`, true)
                .addField('<:info:815147437789282344> Information', `**\`${data.guild.prefix}help information\`**`, true)
                .addField(':1234: Level', `**\`${data.guild.prefix}help level\`**`, true)
                .addField('<:anime:814389558913138688> Anime', `**\`${data.guild.prefix}help animeinfo\`**`, true)
                .addField(':smile: Fun', `**\`${data.guild.prefix}help fun\`**`, true)
                .addField(':camera: Images', `**\`${data.guild.prefix}help images\`**`, true)
                .addField(':game_die: Uno', `**\`${data.guild.prefix}help uno\`**`, true)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | © Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())

            message.channel.send(help)
        }
        else if (args[0] === 'configuration') {

            const configuration = new MessageEmbed()
                .setAuthor("Configuration Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField('configuration',[
                    `\`${data.guild.prefix}setprefix\` - Set your prefix`,
                    `\u200b`,
                    `\`${data.guild.prefix}antispam enable\` - Enables antispam`,
                    `\`${data.guild.prefix}antispam disable\` - Disables antispam`,
                    `\`${data.guild.prefix}antispamcheck\` - Checks if antispam`,
                    `\u200b`,
                    `\`${data.guild.prefix}anticurse enable\` - Enables anticurse`,
                    `\`${data.guild.prefix}anticurse disable\` - Disables anticurse`,
                    `\`${data.guild.prefix}anticursecheck\` - Checks if anticurse if enabled or disabled`,
                    `\u200b`,
                    `\`${data.guild.prefix}setautorole\` - Sets role when someone joins`,
                    `\`${data.guild.prefix}autorole\` - Tells which role autorole is set to`,
                    `\`${data.guild.prefix}autoroledelete\` - Deletes the server autorole from database`,
                    `\u200b`,
                    `\`${data.guild.prefix}ticketsetup\` - Set up or reset the ticket system in the server.`
                ])
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | © Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
            message.channel.send(configuration);
        }
        else if (args[0] === 'animeinfo') {

            const anime = new MessageEmbed()
                .setAuthor("Anime Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                //.addField(`${data.guild.prefix}aavatar`, `Get an Anime Avatar. The output will be NSFW only if the channel is a NSFW channel`, true)
                .addField('Commands',[
                    `\`${data.guild.prefix}anime\` - Get anime information`,
                    `\`${data.guild.prefix}facepalm\` - facepalm anime gif`,
                    `\`${data.guild.prefix}hug\` - hug someone`,
                    `\`${data.guild.prefix}pat\` - pat someone`,
                    `\`${data.guild.prefix}wink\` - winks`,
                    `\`${data.guild.prefix}animetrivia\` - Shows an anime trivia question!`,
                ])
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | © Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
            message.channel.send(anime);
        }
        else if (args[0] === 'fun') {
            const fun = new MessageEmbed()
                .setAuthor("Fun Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField('Commands',[
                    `\`${data.guild.prefix}akinator\` - plays akinator`,
                    `\`${data.guild.prefix}asciify\` - Converts text to ascii characters`,
                    `\`${data.guild.prefix}binary\` - Converts text to binary or vice-versa`,
                    `\`${data.guild.prefix}color\` - Shows about a color (only hex supported)`,
                    `\`${data.guild.prefix}connect4\` - Play connect 4 against another user`,
                    `\`${data.guild.prefix}emojify\` - Returns provided text in emojify (emotes) form.`,
                    `\`${data.guild.prefix}fast\` - Fast typing`,
                    `\`${data.guild.prefix}meme\` - Hangman game`,
                    `\`${data.guild.prefix}poll\` - Does a poll`,
                    `\`${data.guild.prefix}rps\` - Play rock paper scissor with someone`,
                    `\`${data.guild.prefix}rpsme\` - Play rock paper scissor with me`,
                    `\`${data.guild.prefix}sanitize\` - sanitizes the channel`,
                    `\`${data.guild.prefix}say\` - repeats you`,
                    `\`${data.guild.prefix}spotify\` - Makes a spotify status card`,
                    `\`${data.guild.prefix}sudo\` - Make anyone say anything!`,
                    `\`${data.guild.prefix}tictactoe\` - tictactoe with a friend`,
                    `\`${data.guild.prefix}trivia\` - Answer trivia questions`,
                    `\`${data.guild.prefix}trumptweet\` - Display\'s a custom tweet from Donald Trump with the message provided.`,
                    `\`${data.guild.prefix}yt-comment\` - comment youtube`,
                    
                ])
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | © Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
            message.channel.send(fun);
        }
        else if (args[0] === 'general') {
            const general = new MessageEmbed()
                .setAuthor("General Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField(`${data.guild.prefix}about`, `About The Bot`, true)
                .addField(`${data.guild.prefix}bot`, `Gets the current stats of the bot`, true)
                .addField(`${data.guild.prefix}help`, `Help Menu`, true)
                .addField(`${data.guild.prefix}invite`, `To add/invite the bot to your server`, true)
                .addField(`${data.guild.prefix}ping`, `Displays the current API latency`, true)
                .addField(`${data.guild.prefix}uptime`, `To see bots uptime`, true)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | © Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
            message.channel.send(general);
        }
        else if (args[0] === 'images') {

            const images = new MessageEmbed()
                .setAuthor("Image Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField(`${data.guild.prefix}cat`, `Get an image of a cat`, true)
                .addField(`${data.guild.prefix}dog`, `Get an image of a dog`, true)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | © Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
            message.channel.send(images);
        }
        else if (args[0] === 'information') {
            const information = new MessageEmbed()
                .setAuthor("Information Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField('Commands',[
                    `\`${data.guild.prefix}appstore\`  - Show Apple store Application Information Of Your Given Name!`,
                    `\`${data.guild.prefix}avatar\`    - Gets the users avatar`,
                    `\`${data.guild.prefix}calculator\` - Advanced Calculator`,
                    `\`${data.guild.prefix}corona\`    - Shows information about COVID-19`,
                    `\`${data.guild.prefix}djs\`       - Give the discord.js docs`,
                    `\`${data.guild.prefix}imdb\`      - Get the information about series and movie`,
                    `\`${data.guild.prefix}instagram\` - Gets a instagram user details`,
                    `\`${data.guild.prefix}npm\`       - Give npm package information`,
                    `\`${data.guild.prefix}minecraft\` - Shows details about a minecraft server`,
                    `\`${data.guild.prefix}playstore\` - Show Playstore Application Information Of Your Given Name!`,
                    `\`${data.guild.prefix}qr\`   - Generates a qr code from a text or url`,
                    `\`${data.guild.prefix}pokemon\`   - Show pokemon info`,
                    `\`${data.guild.prefix}steam\`     - Show Steam Information`,
                    `\`${data.guild.prefix}urban\`     - Shows you a deffinition from urban dictionary`,
                    `\`${data.guild.prefix}userinfo\`   - Get the users details`,
                    `\`${data.guild.prefix}weather\`   - Get the weather of anywhere`,
                    `\`${data.guild.prefix}wikipedia\` - Finds a Wikipedia Article by title`,
                    `\`${data.guild.prefix}worldclock\`- Returns the current time in diffferent parts of the world`])
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | © Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
            message.channel.send(information);
        } else if (args[0] === 'level') {
            const uno = new MessageEmbed()
                .setAuthor("level Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField('Commands',[
                    `\`${data.guild.prefix}leveling enable\` - Enables leveling in the server`,
                    `\`${data.guild.prefix}leveling disable\` - Disables leveling in the server`,
                    `\`${data.guild.prefix}levelingcheck\` - Checks if leveling is enabled/disabled`,
                    `\`${data.guild.prefix}rank\` - Gives your rank card`,
                    `\`${data.guild.prefix}leaderboard\` - Level leaderboard`])
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | © Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
            message.channel.send(uno);
        }else if (args[0] === 'moderation') {
            const moderation = new MessageEmbed()
                .setAuthor("Moderation Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField('Commands',[
                    `\`${data.guild.prefix}ban\` - Bans the mentioned user from your server.`,
                    `\`${data.guild.prefix}hackban\` - Bans the mentioned user from outside the server.`,
                    `\`${data.guild.prefix}kick\` - Kicks the mentioned user from your server.`,
                    `\`${data.guild.prefix}warn\` - Warns a mentioned user in the server.`,
                    `\`${data.guild.prefix}infractions\` - Lists the warns of a mentioned user in the server.`,
                    `\`${data.guild.prefix}remove-infraction\` - Remove a warns of a mentioned user in the server.`,
                    `\`${data.guild.prefix}remove-all-infractions\` - Remove all warns of a mentioned user in the server.`,
                    `\`${data.guild.prefix}clear\` - clears messages between 1-99`,
                    `\`${data.guild.prefix}embed\` - sends a embedded message`,
                    `\`${data.guild.prefix}giverole\` - Gives role to a user`,
                    `\`${data.guild.prefix}removerole\` - Removes a role from a user`,
                    `\`${data.guild.prefix}lockdown\` - Lock A Channel`,
                    `\`${data.guild.prefix}mute\` - Mutes the mentioned user`,
                    `\`${data.guild.prefix}tempmute\` - Temporarily mutes the mentioned user`,
                    `\`${data.guild.prefix}unmute\` - unmutes the mentioned user`,
                    `\`${data.guild.prefix}nickname\` - to change nickname of someone`,
                    `\`${data.guild.prefix}softban\` - Ban a user from the server temporarily`,
                    `\`${data.guild.prefix}nuke\` - Nukes a given channel`])
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | © Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
            message.channel.send(moderation);
        }
        else if (args[0] === 'music') {
            const music = new MessageEmbed()
                .setAuthor("Music Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField('Commands',[
                    `\`${data.guild.prefix}autoplay\` - Toggles Autoplay`,
                    `\`${data.guild.prefix}filter\` - Changes the audio Filter`,
                    `\`${data.guild.prefix}forward\` - Forwards for a specific amount of Time`,
                    `\`${data.guild.prefix}loop\` - Changes loop from off/song/queue!`,
                    `\`${data.guild.prefix}nowplaying\` - Shows current Track information`,
                    `\`${data.guild.prefix}pause\` - **Pauses** current playing music`,
                    `\`${data.guild.prefix}queue\` - Displays all current **queued** songs`,
                    `\`${data.guild.prefix}resume\` -**Resumes** paused music`,
                    `\`${data.guild.prefix}rewind\` - Rewinds for a specific amount of Time`,
                    `\`${data.guild.prefix}search\` - Skip to the selected queue number`,
                    `\`${data.guild.prefix}seek\` - Seek to a position in the track <Seconds>`,
                    `\`${data.guild.prefix}shuffle\` - Shuffles the Queue`,
                    `\`${data.guild.prefix}skip\` - Skips a track`,
                    `\`${data.guild.prefix}stop\` - **Stops** current playing music`,
                    `\`${data.guild.prefix}volume\` - Changes volume of the bot!`])
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | © Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
            message.channel.send(music);
        } 
        else if (args[0] === 'giveaway') {
            const giveaway = new MessageEmbed()
                .setAuthor("Giveaway Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField('Commands',[
                    `\`${data.guild.prefix}gstart\` - Start a giveaway`,
                    `\`${data.guild.prefix}gend\` - Ends a giveaway`,
                    `\`${data.guild.prefix}greroll\` - Rerolls a giveaway`,
                    `\`${data.guild.prefix}gdrop\` - Start an giveaway where the first person to react wins`
                ])
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | © Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
            message.channel.send(giveaway);
        }
        else if (args[0] === 'uno') {
            const uno = new MessageEmbed()
                .setAuthor("Uno Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **
            \nIf you have never played UNO before this guide will help you.\n
            **Coming Soon**`)


                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | © Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
            message.channel.send(uno);
        }
        else if (args[0] === 'utility') {
            const utility = new MessageEmbed()
                .setAuthor("Utility Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField('Commands',[
                    `\`${data.guild.prefix}addemoji\` - Adds a given Emoji to the server`,
                    `\`${data.guild.prefix}addemojis\` - Adds multiple emojis to the server`,
                    `\`${data.guild.prefix}emojistats\` - See the emoji stats of the server`,
                    `\`${data.guild.prefix}afk\` - Sets your status to AFK`,
                    `\`${data.guild.prefix}announce\` - To announce an embedded message`,
                    `\`${data.guild.prefix}channelinfo\` - Shows information about the channel!`,
                   `\`${data.guild.prefix}createinvite\` - Generate an invite link!`,
                    `\`${data.guild.prefix}firstmessage\` - Find the first message in the channel`,
                    `\`${data.guild.prefix}longestuser\` - Lists all members according to the longest duration of stay`,
                    `\`${data.guild.prefix}membercount\` - No of members in the server`,
                    `\`${data.guild.prefix}permissions\` - Shows permissions of a user`,
                    `\`${data.guild.prefix}remind\` - Set a Reminder`,
                    `\`${data.guild.prefix}staff\` - Shows the staff members of the server`,
                    `\`${data.guild.prefix}slowmode\` - Set the slowmode of a channel`,
                    `\`${data.guild.prefix}time\` - gets the time of a city`,
                    
                ])
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | © Ascenders ${new Date().getFullYear()}`, message.author.displayAvatarURL({dynamic: true}))
            message.channel.send(utility)
        }/*
        else if (args[0] === 'nsfw') {

            if (message.channel.nsfw) {
                const nsfw = new MessageEmbed()
                    .setAuthor("NSFW Module Help")
                    .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                    .addField('Commands',[
                        `\`${data.guild.prefix}4k\` - Get a life`,
                        `\`${data.guild.prefix}anal\` - Get a life`,
                        `\`${data.guild.prefix}ass\` - Get a life`,
                        `\`${data.guild.prefix}boobs\` - Get a life`,
                        `\`${data.guild.prefix}booty\` - Get a life`,
                        `\`${data.guild.prefix}gonewild\` - Get a life`,
                        `\`${data.guild.prefix}pgif\` - Get a life`,
                        `\`${data.guild.prefix}pussy\` - Get a life`,
                        `\`${data.guild.prefix}thigh\` - Get a life`
                    ])
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username} | © Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
                message.channel.send(nsfw)
            } else {
                const nsfw = new MessageEmbed()
                    .setAuthor("NSFW Module Help")
                    .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                    .addField('Roadblock', [
                        `Looks like this is not a NSFW channel. So I cannot show you the commands :slight_smile:`
                    ])
                    .setTimestamp()

                    .setFooter(`Requested by ${message.author.username} | © Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
                message.channel.send(nsfw)
            }
        }
*/

        else {
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(`${message.guild.me.displayName}`, message.guild.iconURL({dynamic: true}))
                .setThumbnail(client.user.displayAvatarURL())

            let cmd = client.commands.get(args[0].toLowerCase())
            if (!cmd) return message.channel.send(embed.setTitle("**Invalid Command!**").setDescription(`**Do \`help\` For the List Of the Commands!**`))

            embed.setDescription(stripIndents`**The prefix in this server is \`${data.guild.prefix}\`**\n
      ** Command -** ${cmd.name}
      ** Description -** ${cmd.description || "No Description provided."}
      ** Usage -** ${cmd.usage ? `\`${data.guild.prefix}${cmd.usage}\`` : "No Usage"}
      ** Needed Permissions -** ${cmd.memberPermissions || "everyone can use this command!"}
      ** Aliases -** ${cmd.aliases ? cmd.aliases.join(", ") : "None."}`)
            embed.setFooter(message.guild.name, message.guild.iconURL())

            return message.channel.send(embed)
        }

    }
}