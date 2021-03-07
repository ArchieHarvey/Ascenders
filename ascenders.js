const Discord = require("discord.js");
const { Collection, Client } = require('discord.js');
const config = require("./config.json"),
  fs = require("fs"),
  util = require("util"),
  readdir = util.promisify(fs.readdir),
mongoose = require("mongoose")

//const client = new Discord.Client({ ws: { properties: { $browser: "Discord Android" }} })
//const client = new Discord.Client
const client = new Discord.Client({ partials: ["MESSAGE", "USER", "REACTION"] });


const { DiscordUNO } = require("discord-uno");

client.discordUNO = new DiscordUNO("YELLOW");

client.queue = new Map() ///For Music Bot
client.events = new Discord.Collection();
client.snipes = new Discord.Collection();
client.commands = new Discord.Collection();
client.data = require("./database/MongoDB.js");
client.logger = require("./Modules/Logger.js");
client.tools = require("./Modules/Tools.js");

const { GiveawaysManager } = require('discord-giveaways')

client.giveaways = new GiveawaysManager(client, {
  storage: './database.json',
  updateCountdownEvery: 10000,
  embedColor: '#ff0000',
  reaction: '🎉'
})

////


//require("./logger")(client);

const path = require('path')
module.exports = client;
client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");
["command", "distube-handler"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

mongoose.connect(config.mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  //If it connects log the following
  client.logger.log("Connected to the Mongodb database.", "log");
}).catch((err) => {
  //If it doesn't connect log the following
  client.logger.log("Unable to connect to the Mongodb database. Error:" + err, "error");
});


///


client.login(config.token)


// if there are errors, log them
client.on("disconnect", () => client.logger.log("Bot is disconnecting...", "warn"))
  .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", (e) => client.logger.log(e, "error"))
  .on("warn", (info) => client.logger.log(info, "warn"));

//For any unhandled errors
process.on("unhandledRejection", (err) => {
  console.error(err);
});


