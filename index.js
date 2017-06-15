const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('./config')
const user = require('./api/user')
const contacts = require('./api/contacts')
const contact = require('./api/contact')
const entries = require('./api/entries')

// Define middleware
app.use(bodyParser.json())

// Register
app.put('/user', user.register)
// Sign in
app.post('/user', user.login)

// Create contact
app.post('/contacts', contacts.create)
// List contacts
app.get('/contacts', contacts.list)

// Update contact
app.post('/contacts/:contactId', contact.update)
// Delete contact
app.delete('/contacts/:contactId', contact.delete)

// Add phone number
app.post('/contacts/:contactId/entries', entries.add)

console.log('Now listening on port ' + config.port)
app.listen(config.port)
