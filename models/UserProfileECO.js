const mongoose = require('mongoose');
const economyprofile = new mongoose.Schema({
    userID: Number,
    inventory: Object,
    inventory: { type: Array, default: [], required: true },
    pocketBalance: { type: Number, default: 1000 },
    hideoutBalance: { type: Number, default: 0 },
    netWorth: Number,
    level: Number,
    createdAt: Date
})
module.exports = mongoose.model("Economy", economyprofile)