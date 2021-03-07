const mongoose = require('mongoose')

const afkSchema = mongoose.Schema({ //Make schema
    guildId: { 
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    afk: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true,
    },
    username: { //So we can change username back
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('afk', afkSchema)