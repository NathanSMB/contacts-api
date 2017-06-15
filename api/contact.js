const db = require('../models')

module.exports = {
  update: (req, res) => {
    if (req.get('Token') && req.body && (req.body.first_name || req.body.last_name)) {
      db.Session.findOne({ _id: req.get('Token') }).then((session) => {
        if (session) {
          let changes = {}
          if (req.body.first_name) {
            changes.first_name = req.body.first_name
          }
          if (req.body.last_name) {
            changes.last_name = req.body.last_name
          }
          db.Contact.update({ _id: req.params.contactId }, {
            $set: changes
          }).then(() => {
            res.status(200).json({
              id: req.params.contactId
            })
          }, (err) => {
            console.error(err)
            res.status(500).json({
              error: 'Could not update contact. Please try again.'
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
        error: 'Something was missing from the request.'
      })
    }
  },
  delete: (req, res) => {
    if (req.get('Token')) {
      db.Session.findOne({ _id: req.get('Token') }).then((session) => {
        if (session) {
          db.Contact.findOne({ _id: req.params.contactId }).remove().then(() => {
            res.status(200).json({})
          }, (err) => {
            console.error(err)
            res.status(500).json({
              error: 'Could not delete contact. Please try again.'
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
        error: 'Something was missing from the request.'
      })
    }
  }
}
