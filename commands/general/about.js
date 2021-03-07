const { MessageEmbed } = require("discord.js");

module.exports = {
    //Command Information
    name: "about",
    description: "About The Ascenders",
    usage: "about",
    enabled: true,
    aliases: [],
    category: "General",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {
        let embed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .setColor(0xd353ef)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(
                `**Hello! I am a multi-purpose bot built for most of the necessary moderation required. I am still under development. Type**: \`${data.guild.prefix}help\` **to see my commands!**`)
            .addField("Links", [
                `<:github:814185028845961237>  [Github](https://github.com/ArchieHarvey/Ascenders)`,
                `:link:  [Invite Me!](https://discordapp.com/oauth2/authorize?&client_id=${client.user.id}&scope=bot&permissions=8)`,
                `:mailbox_with_mail:  [Support Server](https://discord.gg/gpkDA4RdX6)`
            ], true)
            .addField("Youtube", [
                `<:youtube:814187432979333170>  [Ambitunes Music](https://www.youtube.com/channel/UC9gsOMEir7yEOXaQSPxNJ4Q)`,
                `<:youtube:814187432979333170>  [Mr Master](https://www.youtube.com/channel/UCZVqfKCVxlKVZM18LgG6dfg)`,
                `<:youtube:814187432979333170>  [Feronik Gaming](https://www.youtube.com/channel/UCZjzDeblmZJWOZuy3JsueYA)`
            ], true)
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag} | © Ascenders ${new Date().getFullYear()}`, message.author.displayAvatarURL({ dynamic: true }))
        message.channel.send({ embed });
    }
};
