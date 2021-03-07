const { MessageEmbed } = require("discord.js");
const archieembed = require("../../util/archieembed")

module.exports = {

    //Information about command
    name: "clear",
    description: "clears messages between 2-99",
    usage: "[number]",
    enabled: true,
    aliases: ['purge'],
    category: "Moderation",
    memberPermissions: ['MANAGE_MESSAGES'],
    botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    //Execute to command once the settings have been checked
    async execute(client, message, args, data) {

        const prefixtouse = data.config.prefix
        const usage = new MessageEmbed()
            .setColor("#FF0000")
            .setTitle("Command: " + prefixtouse + "purge")
            .setDescription(`**Description:** Purges the channels messages (min 2 max 100)\n**Usage:** \`${prefixtouse}purge <amount> @Someone\`\n**Example:** \`${prefixtouse}purge 20 spam\``)
            .setTimestamp()
            .setFooter(`Command used by ${message.author.tag} (${message.author.id})`)

        const user = message.mentions.users.first()
        const amount = !!parseInt(message.content.split(' ')[2]) ? parseInt(message.content.split(' ')[2]) : parseInt(message.content.split(' ')[1])

        const guildDB = await client.data.getGuildDB(message.guild.id)
        const logChannel = message.guild.channels.cache.get(guildDB.logChannelID);

        let reason = args.slice(3).join(' ');
        if (!reason) reason = '`No reason specified!`';
        if (reason.length > 1024) reason = reason.slice(0, 1021) + '...'
        //let reason = args[3] || `Moderator didn't give a reason.`;

        if (!amount) return message.channel.send(usage);
        if (!amount && !user) return message.channel.send(usage);

        message.channel.messages.fetch({
            limit: amount,
        }).then((messages) => {


            if (user) {

                const filterBy = user ? user.id : client.user.id;
                messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount + 1);
            }
            if (amount <= 1) return message.channel.send("Can only delete a min of 2 messages")
            if (amount >= 100) return message.channel.send("Can only delete a max of 100 messages")
            message.channel.bulkDelete(messages, true).catch(error => console.log(error.stack));
            message.channel.send(`Deleted ${amount} messages`).then(m => m.delete({timeout: 5000}));
            if (!logChannel) {
                return
            } else {


                const embed = new MessageEmbed()
                    .setColor(0x00A2E8)
                    .addField("Moderator", `\`\`\`${message.author.tag} (${message.author.id})\`\`\``, true)
                    .addField("Purge Amount", amount)
                    .addField("In channel", `<#${message.channel.id}> (${message.channel.id})`, true)
                    .addField("Reason", reason, true)
                    .addField("Time used: ", message.createdAt)
                    .setTimestamp()
                //.setFooter("Time used: " + message.createdAt.toDateString())
                return logChannel.send(embed);
            }
        })
    }
}