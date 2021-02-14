const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "help",
    description: "Help Menu",
    usage: "help [module]",
    enabled: false,
    aliases: [""],
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
                .addField('<:TS_anime:807544796142370816> Anime', `**\`${data.guild.prefix}help animeinfo\`**`, true)
                .addField(':smile: Fun', `**\`${data.guild.prefix}help fun\`**`, true)
                .addField(':video_game: Games', `**\`${data.guild.prefix}help games\`**`, true)
                .addField(':question: General', `**\`${data.guild.prefix}help general\`**`, true)
                .addField(':camera: Images', `**\`${data.guild.prefix}help images\`**`, true)
                .addField('<:information:807542581550383115> Information', `**\`${data.guild.prefix}help information\`**`, true)
                .addField(':gear: Moderation', `**\`${data.guild.prefix}help moderation\`**`, true)
                .addField(':tools: Utility', `**\`${data.guild.prefix}help utility\`**`, true)
                .addField(':musical_note: Music', `**\`${data.guild.prefix}help music\`**`, true)
                .addField(':game_die: Uno', `**\`${data.guild.prefix}help uno\`**`, true)
                .addField(':underage: NSFW', `**\`${data.guild.prefix}help nsfw\`**`, true)

                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | ©Ascenders 2020`, client.user.displayAvatarURL())

            message.channel.send(help)
        }
        else if (args[0] === 'animeinfo') {

            const anime = new MessageEmbed()
                .setAuthor("Anime Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField(`${data.guild.prefix}aavatar`, `Get an Anime Avatar. The output will be NSFW only if the channel is a NSFW channel`, true)
                .addField(`${data.guild.prefix}anime`, `Get anime information`, true)
                .addField(`${data.guild.prefix}animetrivia`, `Shows an anime trivia question!`, true)
                .addField(`${data.guild.prefix}neko`, `Get a random Neko.`, true)
                .addField(`${data.guild.prefix}waifu`, `Get a random waifu.`, true)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | ©Ascenders 2020`, client.user.displayAvatarURL())
            message.channel.send(anime);
        }
        else if (args[0] === 'fun') {
            const fun = new MessageEmbed()
                .setAuthor("Fun Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField(`${data.guild.prefix}asciify`, `Converts text to ascii characters`, true)
                .addField(`${data.guild.prefix}emojify`, `Returns provided text in emojify (emotes) form.`, true)
                .addField(`${data.guild.prefix}fast`, `Fast typing`, true)
                .addField(`${data.guild.prefix}hangman`, `Hangman game`, true)
                .addField(`${data.guild.prefix}meme`, `Gives you a meme`, true)
                .addField(`${data.guild.prefix}poll`, `Does a poll`, true)
                .addField(`${data.guild.prefix}sanitize`, `sanitizes the channel`, true)
                .addField(`${data.guild.prefix}say`, `repeats you`, true)
                .addField(`${data.guild.prefix}spotify`, `Makes a spotify status card`, true)
                .addField(`${data.guild.prefix}sudo`, `Make anyone say anything!`, true)
                .addField(`${data.guild.prefix}tictactoe`, `tictactoe with a friend`, true)
                .addField(`${data.guild.prefix}trivia`, `Answer trivia questions`, true)
                .addField(`${data.guild.prefix}trumptweet`, `Display\'s a custom tweet from Donald Trump with the message provided.`, true)
                .addField(`${data.guild.prefix}tweet`, `Tweet something`, true)
                .addField(`${data.guild.prefix}youtube`, `comment youtube`, true)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | ©Ascenders 2020`, client.user.displayAvatarURL())
            message.channel.send(fun);
        }
        else if (args[0] === 'games') {
            const games = new MessageEmbed()
                .setAuthor("Games Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField(`${data.guild.prefix}akinator`, `plays akinator`, true)
                .addField(`${data.guild.prefix}connect4`, `Play connect 4 against another user`, true)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | ©Ascenders 2020`, client.user.displayAvatarURL())
            message.channel.send(games);
        }
        else if (args[0] === 'general') {
            const general = new MessageEmbed()
                .setAuthor("General Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField(`${data.guild.prefix}about`, `About The Bot`, true)
                .addField(`${data.guild.prefix}avatar`, `Get the link for the users Avatar`, true)
                .addField(`${data.guild.prefix}bot`, `Gets the current stats of the bot`, true)
                .addField(`${data.guild.prefix}botstats`, `Also gets the current stats of the bot`, true)
                .addField(`${data.guild.prefix}calculator`, `Basic calculator`, true)
                .addField(`${data.guild.prefix}help`, `Help Menu`, true)
                .addField(`${data.guild.prefix}invite`, `To add/invite the bot to your server`, true)
                .addField(`${data.guild.prefix}ping`, `Displays the current API latency`, true)
                .addField(`${data.guild.prefix}roles`, `Get a list of all the roles`, true)
                .addField(`${data.guild.prefix}server`, `Get information on the current server.`, true)
                .addField(`${data.guild.prefix}speedtest`, `Runs a speedtest`, true)
                .addField(`${data.guild.prefix}staff`, `Get a list of the current staff members`, true)
                .addField(`${data.guild.prefix}uptime`, `To see bots uptime`, true)
                .addField(`${data.guild.prefix}whois`, `Get information about a user`, true)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | ©Ascenders 2020`, client.user.displayAvatarURL())
            message.channel.send(general);
        }
        else if (args[0] === 'images') {

            const images = new MessageEmbed()
                .setAuthor("Anime Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField(`${data.guild.prefix}dog`, `Get an image of a doggo :)`, true)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | ©Ascenders 2020`, client.user.displayAvatarURL())
            message.channel.send(images);
        }
        else if (args[0] === 'information') {
            const information = new MessageEmbed()
                .setAuthor("Information Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField(`${data.guild.prefix}appstore`, `Show Apple store Application Information Of Your Given Name!`, true)
                .addField(`${data.guild.prefix}corona`, `Shows information about COVID-19`, true)
                .addField(`${data.guild.prefix}djs`, `Give the discord.js docs`, true)
                .addField(`${data.guild.prefix}imdb`, `Get the information about series and movie`, true)
                .addField(`${data.guild.prefix}instagram`, `Get the instagram of the requested user`, true)
                .addField(`${data.guild.prefix}npm`, `Give npm package information`, true)
                .addField(`${data.guild.prefix}playstore`, `Show Playstore Application Information Of Your Given Name!`, true)
                .addField(`${data.guild.prefix}pokemon`, `Show pokemon info`, true)
                .addField(`${data.guild.prefix}steam`, `Show Steam Information`, true)
                .addField(`${data.guild.prefix}urban`, `Shows you a deffinition from urban dictionary`, true)
                .addField(`${data.guild.prefix}weather`, `Get the weather of anywhere`, true)
                .addField(`${data.guild.prefix}wikipedia`, `Finds a Wikipedia Article by title`, true)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | ©Ascenders 2020`, client.user.displayAvatarURL())
            message.channel.send(information);
        } else if (args[0] === 'moderation') {
            const moderation = new MessageEmbed()
                .setAuthor("Moderation Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField(`${data.guild.prefix}setprefix`, `Changes to your provided prefix`, true)
                .addField(`${data.guild.prefix}addemoji`, `Adds a given Emoji to the server`, true)
                .addField(`${data.guild.prefix}ban`, `Bans the mentioned user from your server.`, true)
                .addField(`${data.guild.prefix}clear`, `clears messages between 1-99`, true)
                .addField(`${data.guild.prefix}embed`, `sends a embedded message`, true)
                .addField(`${data.guild.prefix}giverole`, `Gives role to a user`, true)
                //.addField(`${data.guild.prefix}goodbye`, `When user leaves server send message to channel`, true)
                .addField(`${data.guild.prefix}kick`, `Kicks the mentioned user from your server.`, true)
                .addField(`${data.guild.prefix}lockdown`, `Lock A Channel`, true)
                .addField(`${data.guild.prefix}mute`, `Mutes the mentioned user`, true)
                .addField(`${data.guild.prefix}nick`, `to change nickname of someone`, true)
                //.addField(`${data.guild.prefix}nickreset`, `x`, true)
                .addField(`${data.guild.prefix}softban`, `Ban a user from the server temporarily`, true)
                .addField(`${data.guild.prefix}tempmute`, `Temporarily mutes the mentioned user`, true)
                .addField(`${data.guild.prefix}unmute`, `unmutes the mentioned user`, true)
                //.addField(`${data.guild.prefix}welcome`, `When user joins server send message to channel`, true)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | ©Ascenders 2020`, client.user.displayAvatarURL())
            message.channel.send(moderation);
        }
        else if (args[0] === 'music') {
            const music = new MessageEmbed()
                .setAuthor("Music Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField(`:radio: ${data.guild.prefix}radio`, `Plays online **radio** from a number of different options`, true)
                .addField(`:notes: ${data.guild.prefix}play`, `**Plays** a song of your choice from YouTube`, true)
                .addField(`:musical_note: ${data.guild.prefix}playlist`, `**Plays** a playlist of your choice from YouTube`, true)
                .addField(`:mag: ${data.guild.prefix}search`, `Searches for a certain title provided, playable`, true)
                .addField(`:play_pause: ${data.guild.prefix}nowplaying`, `Sends the **current playing song title** to message channel`, true)
                .addField(`:pause_button: ${data.guild.prefix}pause`, `**Pauses** current playing music`, true)
                .addField(`:arrow_forward: ${data.guild.prefix}resume`, `**Resumes** paused music`, true)
                .addField(`:stop_button: ${data.guild.prefix}stop`, `**Stops** current playing music`, true)
                .addField(`:fast_forward: ${data.guild.prefix}skip`, `To skip the current music`, true)
                .addField(`:fast_forward: ${data.guild.prefix}skipto`, `Skip to the selected queue number`, true)
                .addField(`:arrows_clockwise: ${data.guild.prefix}loop`, `Loops/replays a song repeatedly`, true)
                .addField(`:loud_sound: ${data.guild.prefix}volume`, `Leave The Voice Channel!`, true)
                .addField(`:scroll: ${data.guild.prefix}lyrics`, `Displays lyrics for current playing song`, true)
                .addField(`:1234: ${data.guild.prefix}queue`, `Displays all current **queued** songs`, true)
                .addField(`${data.guild.prefix}remove`, `Remove song from the queue`, true)
                .addField(`${data.guild.prefix}shuffle`, `Shuffle queue`, true)
                .addField(`${data.guild.prefix}afk`, `24/7`, true)
                .addField(`${data.guild.prefix}leave`, `24/7`, true)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | ©Ascenders 2020`, client.user.displayAvatarURL())
            message.channel.send(music);
        } else if (args[0] === 'uno') {
            const uno = new MessageEmbed()
                .setAuthor("Uno Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **
            \nIf you have never played UNO before this guide will help you.\n
            **Coming Soon**`)


                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | ©Ascenders 2020`, client.user.displayAvatarURL())
            message.channel.send(uno);
        }
        else if (args[0] === 'utility') {
            const utility = new MessageEmbed()
                .setAuthor("Utility Module Help")
                .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                .addField(`${data.guild.prefix}announce`, `to announce an embedded message`, true)
                .addField(`${data.guild.prefix}autorole-check`, `Tells which role autorole is set to`, true)
                .addField(`${data.guild.prefix}autorole`, `Sets role when someone joins`, true)
                .addField(`${data.guild.prefix}createinvite`, `Generate an invite link!`, true)
                .addField(`${data.guild.prefix}firstmessage`, `Find the first message in the channel`, true)
                .addField(`${data.guild.prefix}longestuser`, `Lists all members according to the longest duration of stay`, true)
                .addField(`${data.guild.prefix}membercount`, `No of members in the server`, true)
                .addField(`${data.guild.prefix}nuke`, `Nukes a given channel`, true)
                .addField(`${data.guild.prefix}remind`, `Reminder.`, true)
                .addField(`${data.guild.prefix}slowmode`, `Set the slowmode of a channel.`, true)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | ©Ascenders 2020`, client.user.displayAvatarURL())
            message.channel.send(utility)
        }
        else if (args[0] === 'nsfw') {

            if (message.channel.nsfw) {
                const nsfw = new MessageEmbed()
                    .setAuthor("NSFW Module Help")
                    .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                    .addField(`${data.guild.prefix}4k`, `Get a life.`, true)
                    .addField(`${data.guild.prefix}anal`, `Get a life.`, true)
                    .addField(`${data.guild.prefix}ass`, `Get a life.`, true)
                    .addField(`${data.guild.prefix}boobs`, `Get a life.`, true)
                    .addField(`${data.guild.prefix}booty`, `Get a life.`, true)
                    .addField(`${data.guild.prefix}gonewild`, `Get a life.`, true)
                    .addField(`${data.guild.prefix}pgif`, `Get a life.`, true)
                    .addField(`${data.guild.prefix}pussy`, `Get a life.`, true)
                    .addField(`${data.guild.prefix}thigh`, `Get a life.`, true)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.author.username} | ©Ascenders 2020`, client.user.displayAvatarURL())
                message.channel.send(nsfw)
            } else {
                const nsfw = new MessageEmbed()
                    .setAuthor("NSFW Module Help")
                    .setDescription(`**My Prefix in ${message.guild.name} is \`${data.guild.prefix}\` **`)
                    .addField('Roadblock', [
                        `Looks like this is not a NSFW channel. So I cannot show you the commands :slight_smile:`
                    ])
                    .setTimestamp()

                    .setFooter(`Requested by ${message.author.username} | ©Ascenders 2020`, client.user.displayAvatarURL())
                message.channel.send(nsfw)
            }
        }


        else {
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(`${message.guild.me.displayName}`, message.guild.iconURL())
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