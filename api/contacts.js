const db = require('../models')

module.exports = {
  create: (req, res) => {
    if (req.get('Token') && req.body && (req.body.first_name || req.body.last_name)) {
      db.Session.findOne({ _id: req.get('Token') }).then((session) => {
        if (session) {
          let contact = new db.Contact({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            ownerId: session.userId
          })
          contact.save((err, obj) => {
            if (err) {
              console.error(err)
              res.status(500).json({
                error: 'Error creating contact. Please try again.'
              })
            } else {
              console.log('Created contact: ' + req.body.first_name + ' ' + req.body.last_name)
              res.status(201).json({
                id: obj._id
              })
            }
          })
        } else {
          res.status(401).json({
            error: 'Could not find session. Please login.'
          })
        }
      }, (err) => {
        console.error(err)
        res.status(500).json({
          error: 'Error finding session.'
        })
      })
    } else {
      res.status(400).json({
        error: 'Something was missing from the request.'
      })
    }
  },
  list: (req, res) => {
    if (req.get('Token')) {
      db.Session.findOne({ _id: req.get('Token') }).then((session) => {
        if (session) {
          db.Contact.find({ ownerId: session.userId }).then((contacts) => {
            let fixed = []
            contacts.forEach((val, index) => {
              fixed.push({
                id: contacts[index]._id,
                first_name: contacts[index].first_name,
                last_name: contacts[index].last_name,
                phones: contacts[index].phones
              })
            })
            res.status(200).json(fixed)
          }, (err) => {
            console.error(err)
            res.status(500).json({
              error: 'Could not get contacts. Please try again.'
            })
          })
        } else {
          res.status(401).json({
            error: 'Could not find session. Please login.'
          })
        }
      }, (err) => {
        console.error(err)
        res.status(500).json({
          error: 'Error finding session.'
        })
      })
    } else {
      res.status(400).json({
        success: false,
        error: 'Something was missing from the request.'
      })
    }
  }
}
