const mongoose = require('mongoose')
const config = require('./config')

mongoose.Promise = global.Promise

mongoose.connect('mongodb://127.0.0.1:' + config.mongoPort)

module.exports = {
  User: mongoose.model('User', {
    username: { type: String, index: { unique: true, dropDups: true } },
    password: String
  }),
  Contact: mongoose.model('Contact', {
    first_name: String,
    last_name: String,
    phones: [String],
    ownerId: String
  }),
  Session: mongoose.model('Session', {
    userId: String,
    createdAt: { type: Date, expires: 3600 }
  })
}
