const { MessageEmbed } = require("discord.js")
const fetch = require('node-fetch');

module.exports = {

    //Information about command
    name: "pokemon",
    description: "Show pokemon info",
    usage: "pokemon <Application Name>",
    enabled: true,
    aliases: ["poke"],
    category: "Fun",
    memberPermissions: [],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,
  
    //Execute to command once the settings have been checked
    async execute(client, message, args, data){
    //check if the user entered a pokemon to search for
    if(!args[0]) return message.channel.send('Enter a pokemon to search for!');

    //let the first argument be the name of the pokemon to search for
    const pokemon = args[0].toLowerCase();

    //try to search for the pokemon
    await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`).then(res => res.json()).then(res => {
      const data = res; //convert the name of the pokemon to lower case and attempt to search for the pokemon
      const { sprites, name, id, types, abilities } = data; //deconstruct the returned data to get the information you need

      //TODO: add the evolutions

      //create a new embed with the data and send it to the channel
      let embed = new MessageEmbed()
        .setColor("RED")
        .setTitle(`${name.charAt(0).toUpperCase() + name.slice(1)} #${id}`) //set the title to the name of the pokemon and convert the first letter to uppercase
        .setThumbnail(`${sprites.front_default}`);
        //loop through the types and add a new field for each one
        //convert the first letter of the type name to uppercase
        types.forEach(type => embed.addField('Type', type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1), true));
        //loop through each ability and add a new field for each one
        //convert the first letter of the ability name to uppercase
        abilities.forEach(ability => embed.addField('Ability', ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1), true));
        embed.setFooter(`© ${message.guild.me.displayName}`, client.user.displayAvatarURL()); 

      message.channel.send(embed);
    }).catch(err => {
      console.log(err); //log the error if it occurs

      //send a message to the channel asking if they typed in the name of the pokemon correctly
      message.channel.send(`The Pokemon ${pokemon} doesn't exist.`);
    });
  }
}