const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js')

module.exports = {

    //Information about command
    name: "djs",
    description: "Give the discord.js docs",
    usage: "<search>",
    enabled: true,
    aliases: ["discordjs", "docs"],
    category: "Fun",
    memberPermissions: [],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,
  
    //Execute to command once the settings have been checked
    async execute(client, message, args, data){
           // Variables
           const doc = args.slice().join(' ')
        if(!doc) return message.reply('Please Provide A Query To Search For.') // If No Query Is Searched
        const url = 'https://djsdocs.sorta.moe/v2/embed?src=stable&q=' + doc // <v2> Can Be Chnaged To <v1> // <stable> Can Be Changed To <master>

        let response
        try {
            response = await fetch(url).then(res => res.json())
        }
        catch (e) {
            return message.reply('An Error Occured, Try Again Later.')    
        }

        const pkg = response
        const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setThumbnail('https://cdn.discordapp.com/emojis/586438523796848640.png?v=1') // Discord.JS Image // You Can Change It
        .setAuthor(pkg.author.name, pkg.author.icon_url)
        .setDescription(pkg.description)
        .setTimestamp()
        // If The Docs Searched Has Fields
        if(pkg.fields) {embed.addFields(pkg.fields)}
        // If The Docs Searched Has Title
        if(pkg.title) {embed.setTitle(pkg.title)}
        message.channel.send(embed)
    }
}