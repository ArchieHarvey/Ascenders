const canvacord = require("canvacord");
const Discord = require("discord.js")
const fetch = require("node-fetch");
module.exports = {
    name: "tweet",
  description: "Tweet something",
  usage: "tweet [username] [text]",
  enabled: true,
  aliases: [""],
  category: "Utility",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  //Settings for command
  nsfw: false,
  ownerOnly: false,
  cooldown: 0,

    async execute(client, message, args, data){
    const m = await message.channel.send("Please wait....")
        let user = args[0];
        let text = args.slice(1).join(" ");


        if(!user){
            return m.edit("**You Have To Enter Someone's Twitter Nickname!**");
        }

        if(!text){
            return m.edit("**You must enter a message!**");
        }

        try {
            let res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=tweet&username=${member[0].user.username}&text=${text}`));
            let json = await res.json();
            let attachment = new Discord.MessageAttachment(json.message, "tweet.png");
            await message.channel.send(``, attachment);
            m.delete();
        } catch(e){
            m.edit("Error, Try Again! Mention Someone");
        }
}
}