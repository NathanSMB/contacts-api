const db = require('../models')
const phone = require('phone')

module.exports = {
  add: (req, res) => {
    if (req.get('Token') && req.body && req.body.phone) {
      db.Session.findOne({ _id: req.get('Token') }).then((session) => {
        if (session) {
          let pn = phone(req.body.phone)
          if (pn[0]) {
            db.Contact.update({ _id: req.params.contactId }, {
              $push: {
                phones: pn[0] // pn is an array containing the phone number[0] and country code[1].
              }
            }).then(() => {
              res.status(201).json({
                id: req.params.contactId
              })
            }, (err) => {
              console.error(err)
              res.status(500).json({
                error: 'Could not update contact. Please try again.'
              })
            })
          } else {
            res.status(400).json({
              error: 'Invalid phone number format. It should be an internationally formatted phone number.'
            })
          }
        } else {
          res.status(400).json({
            error: 'Could not find session. Please login.'
          })
        }
      }, (err) => {
        console.error(err)
        res.status(400).json({
          error: 'Error finding session.'
        })
      })
    } else {
      res.status(400).json({
        error: 'Something was missing from the request.'
      })
    }
  }
}
