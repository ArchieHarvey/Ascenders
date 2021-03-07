const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {

    //Information about command
    name: "github",
    description: "Github Repository Information!",
    usage: "[repository name]",
    enabled: true,
    aliases: [],
    category: "Fun",
    memberPermissions: [],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,
  
    //Execute to command once the settings have been checked
    async execute(client, message, args, data){
        if(!args[0]) return message.channel.send("What repository am i supposed to show you?");

        const [username, repository] = args[0].split("/");
        if(!username || !args[0]) return message.channel.send("Repository must be in the form `username/repository`");
    
        const body = await fetch(`https://api.github.com/repos/${username}/${repository}`)
          .then((res) => res.ok && res.json())
          .catch(() => null);
    
        if(!body) return message.channel.send("Could not fetch that repo, are you sure it exists?");
    
        const size = body.size <= 1024 ? `${body.size} KB` : Math.floor(body.size / 1024) > 1024 ? `${(body.size / 1024 / 1024).toFixed(2)} GB` : `${(body.size / 1024).toFixed(2)} MB`;
        const license = body.license && body.license.name && body.license.url ? `[${body.license.name}](${body.license.url})` : body.license && body.license.name || "None";
        const footer = [];
        if(body.fork) footer.push(`❯ **Forked** from [${body.parent.full_name}](${body.parent.html_url})`);
        if(body.archived) footer.push("❯ This repository is **Archived**");
    
        const embed = new MessageEmbed()
          .setTitle(body.full_name)
          .setAuthor("GitHub", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")
          .setURL(body.html_url)
          .setThumbnail(body.owner.avatar_url)
          .setDescription(`${body.description || "No Description."}\n\n❯ **Language:** ${body.language}\n❯ **Forks:** ${body.forks_count.toLocaleString()}\n❯ **License:** ${license}\n❯ **Open Issues:** ${body.open_issues.toLocaleString()}\n❯ **Watchers:** ${body.subscribers_count.toLocaleString()}\n❯ **Stars:** ${body.stargazers_count.toLocaleString()}\n❯ **Clone Size:** ${size}${footer.length ? `\n${footer.join("\n")}` : ""}`);
    
        return message.channel.send({ embed });
  }
}