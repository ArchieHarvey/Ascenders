const Discord = require("discord.js");
const { Collection, Client } = require('discord.js');
const config = require("./config.json")

//const client = new Discord.Client({ ws: { properties: { $browser: "Discord Android" }} })
//const client = new Discord.Client
const client = new Discord.Client({ partials: ["MESSAGE", "USER", "REACTION"] });

client.login(config.token)
