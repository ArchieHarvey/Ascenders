const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const { stripIndent } = require("common-tags");

module.exports = {
  //Command Information
  name: "serverinfo",
  description: "Get information on the current server.",
  usage: "serverinfo",
  enabled: false,
  aliases: ["server"],
  category: "General",
  memberPermissions: [],
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client, message, args, data) {
    const region = {
      "us-central": ":flag_us:  `US Central`",
      "us-east": ":flag_us:  `US East`",
      "us-south": ":flag_us:  `US South`",
      "us-west": ":flag_us:  `US West`",
      "europe": ":flag_eu:  `Europe`",
      "singapore": ":flag_sg:  `Singapore`",
      "japan": ":flag_jp:  `Japan`",
      "russia": ":flag_ru:  `Russia`",
      "hongkong": ":flag_hk:  `Hong Kong`",
      "brazil": ":flag_br:  `Brazil`",
      "sydney": ":flag_au:  `Sydney`",
      "southafrica": "`South Africa` :flag_za:",
      "india": ":flag_in: India"
    };
    const verificationLevels = {
      NONE: "`None`",
      LOW: "`Low`",
      MEDIUM: "`Medium`",
      HIGH: "`High`",
      VERY_HIGH: "`Highest`"
    };
    const notifications = {
      ALL: "All",
      MENTIONS: "Mentions"
    };

    const days = Math.floor(
      (new Date() - message.guild.createdAt) / (1000 * 60 * 60 * 24)
    );
    const bans = await message.guild
      .fetchBans()
      .then(bans => bans.size)
      .catch(() => "Couldn't fetch bans.");

    // Get channel stats

    const embed = new MessageEmbed()
      .setThumbnail(message.guild.iconURL())
      .setColor("#f3f3f3")
      .setTitle(
        `Here is some information I found for this server: ${message.guild.name}`
      )
      .addField("Server Info", [
        `**Members:** There are ${message.guild.memberCount} users 🧍!`,
        `**Guild Name:** ${message.guild.name}`,
        `**Guild ID**: ${message.guild.id}`,
        `**Region:** ${region[message.guild.region]}`,
        `**Guild Created: ${message.guild.createdAt.toDateString()} (${days} days ago!**)`,
        `**Bans:** ${bans}`
      ])
      .setTimestamp(message.guild.createdAt)
      .addField(
        "Rules Channel",
        message.guild.rulesChannel ? `${message.guild.rulesChannel}` : "None",
        true
      )
      .addField(
        "System Channel",
        message.guild.systemChannel
          ? `${message.guild.systemChannel}`
          : "None",
        true
      )
      .addField(
        "AFK Channel",
        message.guild.afkChannel
          ? `${message.guild.afkChannel.name}`
          : "None",
        true
      )
      .addField(
        "AFK Timeout",
        message.guild.afkChannel
          ? `${moment
              .duration(message.guild.afkTimeout * 1000)
              .asMinutes()} minutes`
          : "None",
        true
      )
      
      .addField("Partnered", `${message.guild.partnered || "Not Partnered"}`, true)
      .addField("Verified", `${message.guild.verified || "Not Verified"}`, true)
      
      
      .addField("**Total Roles**", message.guild.roles.cache.size, true)
      .addField("**Total Emojis**", message.guild.emojis.cache.size, true)
      
      .addField("**Verification Level**", message.guild.verificationLevel, true)
      .addField(
        "Default Notifications",
        notifications[message.guild.defaultMessageNotifications],
        true
      )
      .addField(
        "**Explicit Content Filter**",
        message.guild.explicitContentFilter,
        true
      )
      .addField("**Owner**", `<@${message.guild.ownerID}>`, true)
      .addField(
        `Server Boosts`,
        `Level: ${message.guild.premiumTier}\nAmount: ${message.guild
          .premiumSubscriptionCount || 0}`, true
      )
      .addField("Boosting Tier", `Tier ${message.guild.premiumTier}`, true)
      
      .addField(
        "**Community Features**",
        `${message.guild.features.join(", ") || "No Community Features!"}`,
        true
      )
      .addField(
        "**Channels**",
        `⌨️ ${
          message.guild.channels.cache.filter(channel => channel.type == "text")
            .size
        } \| 🔈 ${
          message.guild.channels.cache.filter(
            channel => channel.type == "voice"
          ).size
        } \| 📁 ${
          message.guild.channels.cache.filter(
            channel => channel.type == "category"
          ).size
        } \| 📢 ${
          message.guild.channels.cache.filter(channel => channel.type == "news")
            .size
        }`,
        true
      )
      
      .setFooter("© Ascenders 2020", client.user.displayAvatarURL());

    await message.channel.send(embed);
  }
};
