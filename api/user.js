const db = require('../models')
const bcrypt = require('bcrypt')
const config = require('../config')

module.exports = {
  register: (req, res) => {
    if (req.body && req.body.username && req.body.password) {
      bcrypt.hash(req.body.password, config.saltRounds)
        .then((hashedPassword) => {
          let newUser = new db.User({
            username: req.body.username,
            password: hashedPassword
          })
          newUser.save((err) => {
            if (err) {
              console.error(err)
              res.status(500).json({
                error: 'Error creating user.'
              })
            } else {
              console.log('Created user: ' + req.body.username)
              res.status(201).json({})
            }
          })
        }, (err) => {
          console.error(err)
          res.status(500).json({
            error: 'Error creating user.'
          })
        })
    } else {
      res.status(400).json({
        error: 'Username or password was missing from the request.'
      })
    }
  },
  login: (req, res) => {
    if (req.body && req.body.username && req.body.password) {
      db.User.findOne({ username: req.body.username }).then((user) => {
        if (user) {
          bcrypt.compare(req.body.password, user.password).then((success) => {
            if (success) {
              let session = new db.Session({
                userId: user._id,
                createdAt: new Date()
              })
              session.save((err, obj) => {
                if (err) {
                  console.error(err)
                  res.status(500).json({
                    error: 'Error creating session. Please try again.'
                  })
                } else {
                  console.log('Created session for: ' + req.body.username)
                  res.status(201).json({
                    token: obj._id
                  })
                }
              })
            } else {
              res.status(401).json({
                error: 'Username or password is incorrect.'
              })
            }
          }, (err) => {
            console.error(err)
            res.status(500).json({
              error: 'Error validating password. Please try again.'
            })
          })
        } else {
          res.status(401).json({
            error: 'Username or password is incorrect.'
          })
        }
      }, (err) => {
        console.error(err)
        res.status(401).json({
          error: 'Username or password is incorrect.'
        })
      })
    } else {
      res.status(400).json({
        error: 'Username or password was missing from the request.'
      })
    }
  }
}
