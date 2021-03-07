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
    const members = message.guild.members.cache.array();
    const online = members.filter((m) => m.presence.status === 'online').length;
    const offline = members.filter((m) => m.presence.status === 'offline').length;
    const dnd = members.filter((m) => m.presence.status === 'dnd').length;
    const afk = members.filter((m) => m.presence.status === 'idle').length;
    
    const embed = new MessageEmbed()
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setColor("#f3f3f3")
      .setDescription(stripIndent`
        **Online:** \`${online}\` | **Busy:** \`${dnd}\` | **AFK:** \`${afk}\` | **Offline:** \`${offline}\`
      `)
      .setTitle(
        `Here is some information I found for this server: ${message.guild.name}`
      )
      .addField("Server Info", [
        `**Partnered:** ${message.guild.partnered || "Not Partnered"}`,
        `**Verified:** ${message.guild.verified || "Not Verified"}`,
        `**Total Roles:** ${message.guild.roles.cache.size}`,
        `**Total Emojis:** ${message.guild.emojis.cache.size}`,
        `**Verification Level:** ${message.guild.verificationLevel}`,
        `**Default Notifications:** ${notifications[message.guild.defaultMessageNotifications]}`,
        `**Explicit Content Filter:** ${message.guild.explicitContentFilter}`,
        `**Owner:** <@${message.guild.ownerID}>`
      ], true
      )
      .addField("Server Info", [
        `**Members:** There are ${message.guild.memberCount} users 🧍!`,
        `**Guild Name:** ${message.guild.name}`,
        `**Guild ID**: ${message.guild.id}`,
        `**Region:** ${region[message.guild.region]}`,
        `**Guild Created: ${message.guild.createdAt.toDateString()} (${days} days ago!**)`,
        `**Bans:** ${bans}`
      ],true)
      .addField('\u200b', '\u200b', false)
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
      
      .addField(
        "**Community Features**",
        `${message.guild.features.join(", ") || "No Community Features!"}`,
        true
      )
      .addField(
        "**Channels**", [
        `**Text Channels:** ${message.guild.channels.cache.filter(channel => channel.type == "text").size}`,
        `**Voice Channels:** ${message.guild.channels.cache.filter(channel => channel.type == "voice").size}`,
        `**Announcement Channels:** ${message.guild.channels.cache.filter(channel => channel.type == "news").size}`,
        `**Categories:** ${message.guild.channels.cache.filter(channel => channel.type == "category").size}`
      ], true
      )
      .addField('Boosting', [
        `**Boosting Tier:** ${message.guild.premiumTier}`,
        `**Boosting Count:** ${message.guild.premiumSubscriptionCount || 0}`
      ], true)
      .setFooter(`© Ascenders ${new Date().getFullYear()}`, client.user.displayAvatarURL())
      .setTimestamp(message.guild.createdAt)
    await message.channel.send(embed);
  }
};
