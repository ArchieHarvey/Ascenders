const mongoose = require("mongoose");

module.exports = mongoose.model("Users", new mongoose.Schema({

    id: { type: String },
    registeredAt: { type: Number, default: Date.now() },
    guildID: { type: String },
    userID: { type: String },

}));
