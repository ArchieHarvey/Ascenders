const { WebhookClient, MessageEmbed } = require('discord.js')

module.exports = {

    //Information about command
    name: "webhook",
    description: "sends a webhook",
    usage: "welcome set #channel\nwelcome custom <text>\nwelcome disable",
    enabled: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: [ "ADMINISTRATOR" ],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    //Settings for command
    nsfw: false,
    ownerOnly: true,
    cooldown: 0,
  
    //Execute to command once the settings have been checked
    async execute(client, message, args, data){
        //https://discord.com/api/webhooks/803713675750801448/9mT3Fa4Ja-Jk315YTTaZu1g-zOXdLWa1prY_ZxapHr0wCulQ6ClqagUE23JLUdEzRIjU
    const wc = new WebhookClient('803713675750801448', '9mT3Fa4Ja-Jk315YTTaZu1g-zOXdLWa1prY_ZxapHr0wCulQ6ClqagUE23JLUdEzRIjU')
        const embed = new MessageEmbed()
            .setTitle("this is an embed").setColor('GREEN').setTimestamp().setDescription(args.join(" "))
    wc.send({
        username : message.author.tag,
        avatarURL : message.author.displayAvatarURL({ dynamic : true }),
        embeds : [embed]
    })
    }
}