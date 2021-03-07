const Discord = require('discord.js');
const math = require('mathjs');

module.exports = {
    //Command Information
    name: "calculator",
    description: "Shows Calculated Answers",
    usage: "calculator <query.",
    enabled: true,
    aliases: ["calculate"],
    category: "General",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {

        const errmessage = new Discord.MessageEmbed()
            .setAuthor(message.author.tag + " | Advanced Calculator", message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`**Enter Valid Calculation!**
            
            **List of Calculations** - 

            1. **sqrt equation** - \`sqrt(3^2 + 4^2) = 5\`
            2. **Units to Units** - \`2 inch to cm = 0.58\`
            3. **Complex Expressions Like** - \`cos(45 deg) = 0.7071067811865476\`
            4. **Basic Maths Expressions** - \`+, -, ^, /, decimals\` = **2.5 - 2 = 0.5**


            `)
            .setFooter(`© Ascenders ${new Date().getFullYear()}`)
            .setTimestamp()

        if (!args[0]) return message.channel.send(errmessage);

        let result;
        try {
            result = math.evaluate(args.join(" ").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/"));
        } catch (e) {
            return message.channel.send(errmessage);
        }

        let embed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`Calculator`, message.author.displayAvatarURL({ dynamic: true }))
            .addField("**Operation**", `\`\`\`Js\n${args.join("").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/")}\`\`\``)
            .addField("**Result**", `\`\`\`Js\n${result}\`\`\``)
            .setFooter(message.guild.name, message.guild.iconURL());
        message.channel.send(embed);
    }
}