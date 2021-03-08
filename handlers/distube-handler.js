const Distube = require("distube");
const ee = require("../botconfig/embed.json");
const config = require("../botconfig/config.json");
const { MessageEmbed } = require("discord.js");
const { format, delay } = require("../handlers/functions")
module.exports = (client) => {
  if (config.music_settings.youtube_cookie.length > "Set your Cookie here, to prevent 429! TUTORIAL https://youtu.be/qymuvhBetnM".length) {
    client.distube = new Distube(client, {
      searchSongs: config.music_settings.searchSongs,
      emitNewSongOnly: config.music_settings.emitNewSongOnly,
      highWaterMark: config.music_settings.highWaterMark,
      leaveOnEmpty: config.music_settings.leaveOnEmpty,
      youtubeCookie: config.music_settings.youtube_cookie,
      leaveOnFinish: config.music_settings.leaveOnFinish,
      leaveOnStop: config.music_settings.leaveOnStop,
      youtubeDL: config.music_settings.youtubeDL,
      updateYouTubeDL: config.music_settings.updateYouTubeDL,
      customFilters: {
        "clear": "dynaudnorm=f=200",
        "lowbass": "bass=g=6,dynaudnorm=f=200",
        "bassboost": "bass=g=20,dynaudnorm=f=200",
        "purebass": "bass=g=20,dynaudnorm=f=200,asubboost,apulsator=hz=0.08",
        "8D": "apulsator=hz=0.08",
        "vaporwave": "aresample=48000,asetrate=48000*0.8",
        "nightcore": "aresample=48000,asetrate=48000*1.25",
        "phaser": "aphaser=in_gain=0.4",
        "tremolo": "tremolo",
        "vibrato": "vibrato=f=6.5",
        "reverse": "areverse",
        "treble": "treble=g=5",
        "normalizer": "dynaudnorm=f=200",
        "surrounding": "surround",
        "pulsator": "apulsator=hz=1",
        "subboost": "asubboost",
        "karaoke": "stereotools=mlev=0.03",
        "flanger": "flanger",
        "gate": "agate",
        "haas": "haas",
        "mcompand": "mcompand"
      }
    })
  }
  else {
    client.distube = new Distube(client, {
      searchSongs: config.music_settings.searchSongs,
      emitNewSongOnly: config.music_settings.emitNewSongOnly,
      highWaterMark: config.music_settings.highWaterMark,
      leaveOnEmpty: config.music_settings.leaveOnEmpty,
      leaveOnFinish: config.music_settings.leaveOnFinish,
      leaveOnStop: config.music_settings.leaveOnStop,
      youtubeDL: config.music_settings.youtubeDL,
      updateYouTubeDL: config.music_settings.updateYouTubeDL,
      customFilters: {
        "clear": "dynaudnorm=f=200",
        "lowbass": "bass=g=6,dynaudnorm=f=200",
        "bassboost": "bass=g=20,dynaudnorm=f=200",
        "purebass": "bass=g=20,dynaudnorm=f=200,asubboost,apulsator=hz=0.08",
        "8D": "apulsator=hz=0.08",
        "vaporwave": "aresample=48000,asetrate=48000*0.8",
        "nightcore": "aresample=48000,asetrate=48000*1.25",
        "phaser": "aphaser=in_gain=0.4",
        "tremolo": "tremolo",
        "vibrato": "vibrato=f=6.5",
        "reverse": "areverse",
        "treble": "treble=g=5",
        "normalizer": "dynaudnorm=f=200",
        "surrounding": "surround",
        "pulsator": "apulsator=hz=1",
        "subboost": "asubboost",
        "karaoke": "stereotools=mlev=0.03",
        "flanger": "flanger",
        "gate": "agate",
        "haas": "haas",
        "mcompand": "mcompand"
      }
    })
  }
  // Queue status template
  const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

  // DisTube event listeners, more in the documentation page
  client.distube
    .on("playSong", (message, queue, song) => {
      message.channel.send(new MessageEmbed()
        .setAuthor(`Playing Music`)
        .setColor(ee.color)
        .addField("Name", `[${song.title}](${song.url})`, true)
        .addField("Duration", `\`${song.formattedDuration}\``, true)
        .addField("Requested by", song.user.tag, true)
        .addField("QueueStatus", status(queue))
        .setThumbnail(song.thumbnail)
        .setFooter(`Requested by: ${song.user.tag}`, song.user.displayAvatarURL({ dynamic: true }))
      ).then(async msg => {
        let emojiarray = ["⏭", "⏹", "⏯", "⏪", "⏩", "🔉", "🔊"];
        for (const emoji of emojiarray)
          await msg.react(emoji)

        var filter = (reaction, user) => emojiarray.includes(reaction.emoji.name) && user.id !== message.client.user.id;


        var collector = await msg.createReactionCollector(filter, { time: song.duration > 0 ? song.duration * 1000 : 180000 });
        collector.on("collect", async (reaction, user) => {
          if (!queue) return;
          const member = reaction.message.guild.member(user);
          reaction.users.remove(user);
          if (!member.voice.channel)
            return message.channel.send(`<:denied:811890796806406174> Please join a voice channel.`)
          if (member.voice.channel.id !== member.guild.voice.channel.id)
            return message.channel.send(`<:denied:811890796806406174> Please join my Voice Channel. The channel I am in: \`${member.guild.voice.channel.name}\``)

          switch (reaction.emoji.name) {
            case "⏭":
              reaction.message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`⏭ Skipped the track`)
              ).then(msg => msg.delete({ timeout: 3000 }).catch(e => console.log(e.message)))
              client.distube.skip(reaction.message)
              break;
            case "⏹":
              reaction.message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`⏹ Stopped playing and left the channel`)
              ).then(msg => msg.delete({ timeout: 3000 }).catch(e => console.log(e.message)))
              client.distube.stop(reaction.message)
              break;
            case "⏯":
              if (client.distube.isPaused(message)) {
                client.distube.resume(message);
                await delay(100);
                client.distube.pause(message);
                await delay(100);
                client.distube.resume(message);
                return message.channel.send(new MessageEmbed()
                  .setColor(ee.color)
                  .setFooter(ee.footertext, ee.footericon)
                  .setTitle("▶ Resumed the Song")
                ).then(msg => msg.delete({ timeout: 3000 }).catch(e => console.log(e.message)))
              }
              message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle("⏸ Paused the Song")
              ).then(msg => msg.delete({ timeout: 3000 }).catch(e => console.log(e.message)))
              client.distube.pause(message);

              break;
            case "⏪":
              let seektime = queue.currentTime - 15 * 1000;
              if (seektime < 0)
                seektime = 0;
              if (seektime >= queue.songs[0].duration * 1000 - queue.currentTime)
                seektime = 0;
              client.distube.seek(message, seektime);
              message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`⏪ Rewinded for \`15 Seconds\` to: ${format(seektime)}`)
              ).then(msg => msg.delete({ timeout: 4000 }).catch(e => console.log(e.message)))
              break;
            case "⏩":
              let seektime2 = queue.currentTime + 15 * 1000;
              if (seektime2 < 0)
                seektime2 = queue.songs[0].duration * 1000;
              if (seektime2 >= queue.songs[0].duration * 1000)
                seektime2 = queue.songs[0].duration * 1000 - 1000;
              client.distube.seek(message, seektime2);
              message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`⏩ Forwarded for \`15 Seconds\` to: ${format(seektime2)}`)
              ).then(msg => msg.delete({ timeout: 4000 }).catch(e => console.log(e.message)))
              break;
            case "🔉":
              client.distube.setVolume(message, queue.volume - 10);
              if (queue.volume < 10) client.distube.setVolume(message, 0);
              return message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`🔉 Reduced the Volume for \`10 %\` to: \`${queue.volume}%\``)
              ).then(msg => msg.delete({ timeout: 4000 }).catch(e => console.log(e.message)))
              break;
            case "🔊":
              client.distube.setVolume(message, queue.volume + 10);
              if (queue.volume > 150) client.distube.setVolume(message, 150);
              return message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`🔉 Reduced the Volume for \`10 %\` to: \`${queue.volume}%\``)
              ).then(msg => msg.delete({ timeout: 4000 }).catch(e => console.log(e.message)))
              break;
          }
        })
        collector.on("end", () => {
          try {
            msg.delete()
          } catch {
          }
        })
      })
    }
    )
    .on("playList", (message, queue, playlist, song) => message.channel.send(new MessageEmbed()
      .setTitle("Playing Playlist :notes: " + playlist.name + ` - \`[${playlist.songs.length} songs]\``)
      .setURL(playlist.url)
      .setColor(ee.color)
      .addField("Current Track: ", `[${song.name}](${song.url})`)
      .addField("Duration", `\`${playlist.formattedDuration}\``)
      .addField(`${queue.songs.length} Songs in the Queue`, `Duration: \`${format(queue.duration * 1000)}\``)
      .setThumbnail(playlist.thumbnail.url)
      .setFooter(`Requested by: ${song.user.tag}`, song.user.displayAvatarURL({ dynamic: true }))
    )
    )
    .on("addList", (message, queue, playlist) => message.channel.send(new MessageEmbed()
      .setTitle("Added Playlist :thumbsup: " + playlist.name + ` - \`[${playlist.songs.length} songs]\``)
      .setURL(playlist.url)
      .setColor(ee.color)
      .addField("Duration", `\`${playlist.formattedDuration}\``)
      .addField(`${queue.songs.length} Songs in the Queue`, `Duration: \`${format(queue.duration * 1000)}\``)
      .setThumbnail(playlist.thumbnail.url)
      .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    )
    )
    .on("searchResult", (message, result) =>
      message.channel.send(new MessageEmbed()
        .setTitle("**Choose an option from below**")
        .setURL(song.url)
        .setColor(ee.color)
        .setDescription(`${result.map((song, i) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n\n*Enter anything else or wait 60 seconds to cancel*`)
        .setFooter(ee.footertext, ee.footericon)
      )
    )
    .on("searchCancel", (message) => message.channel.send(new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setFooter(ee.footertext, ee.footericon)
      .setTitle(`❌ ERROR | Search Cancelled`)
    )
    )
    .on("error", (message, e) => {
      console.log(String(e.stack).bgRed)
    })
    .on("initQueue", queue => {
      queue.autoplay = false;
      queue.volume = 75;
      queue.filter = "lowbass";
    }
    )

}
