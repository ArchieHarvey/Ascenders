const client = require('../ascenders')
const { GiveawayClient } = require('reconlx')
const config = require("../config.json")

const giveaway = new GiveawayClient(client, {
    mongoURI: config.mongoDB,
    emoji: "🎉",
    defaultColor: "RED",
});

module.exports = giveaway;