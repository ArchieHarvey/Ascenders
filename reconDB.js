const { reconDB }  = require('reconlx')

const db = new reconDB({
    uri : require('./config.json').mongoDB
})

module.exports = db;