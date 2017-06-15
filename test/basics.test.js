require('../')
const chai = require('chai')
const rp = require('request-promise-native')
const config = require('../config')
const db = require('../models')

chai.should()

let token
let contactId = {}

describe('API', () => {
  describe('User', () => {
    it('#PUT', () => {
      return rp({
        method: 'PUT',
        uri: 'http://127.0.0.1:' + config.port + '/user',
        json: true,
        body: {
          'username': 'TestUser',
          'password': 'testing123'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((body) => {
        body.should.have.property('success')
        body.success.should.equal(true)
      })
    })
    it('#POST', () => {
      return rp({
        method: 'POST',
        uri: 'http://127.0.0.1:' + config.port + '/user',
        json: true,
        body: {
          'username': 'TestUser',
          'password': 'testing123'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((body) => {
        body.should.have.property('token')
        token = body.token
      })
    })
  })
  describe('Contacts', () => {
    it('#POST(1)', () => {
      return rp({
        method: 'POST',
        uri: 'http://127.0.0.1:' + config.port + '/contacts',
        json: true,
        body: {
          'first_name': 'Dick',
          'last_name': 'Grayson'
        },
        headers: {
          'Content-Type': 'application/json',
          'Token': token
        }
      }).then((body) => {
        body.should.have.property('id')
        contactId.nightwing = body.id
      })
    })
    it('#POST(2)', () => {
      return rp({
        method: 'POST',
        uri: 'http://127.0.0.1:' + config.port + '/contacts',
        json: true,
        body: {
          'first_name': 'Jason',
          'last_name': 'Todd'
        },
        headers: {
          'Content-Type': 'application/json',
          'Token': token
        }
      }).then((body) => {
        body.should.have.property('id')
        contactId.redhood = body.id
      })
    })
    it('#GET', () => {
      return rp({
        method: 'GET',
        uri: 'http://127.0.0.1:' + config.port + '/contacts',
        json: true,
        headers: {
          'Content-Type': 'application/json',
          'Token': token
        }
      }).then((body) => {
        chai.assert(Array.isArray(body) && body.length === 2, 'The array exists and is the correct length.')
        chai.assert(body[0].first_name === 'Jason' || body[0].first_name === 'Dick', 'Contact 1 is one of the correct contacts.')
        chai.assert(body[1].last_name === 'Todd' || body[1].last_name === 'Grayson', 'Contact 1 is one of the correct contacts.')
        chai.assert(body[0].first_name !== body[1].first_name, 'Both contacts are different.')
      })
    })
  })
  describe('Contact', () => {
    it('#POST', () => {
      return rp({
        method: 'POST',
        uri: 'http://127.0.0.1:' + config.port + '/contacts/' + contactId.redhood,
        json: true,
        body: {
          'first_name': 'Red',
          'last_name': 'Hood'
        },
        headers: {
          'Content-Type': 'application/json',
          'Token': token
        }
      }).then((body) => {
        body.should.have.property('id')
      })
    })
    it('#DELETE', () => {
      return rp({
        method: 'DELETE',
        uri: 'http://127.0.0.1:' + config.port + '/contacts/' + contactId.nightwing,
        json: true,
        headers: {
          'Content-Type': 'application/json',
          'Token': token
        }
      }).then((body) => {
        chai.assert(JSON.stringify(body) === '{}', 'Response should be empty.')
      })
    })
  })
  describe('Entries', () => {
    it('#POST(1)', () => {
      return rp({
        method: 'POST',
        uri: 'http://127.0.0.1:' + config.port + '/contacts/' + contactId.redhood + '/entries',
        json: true,
        body: {
          'phone': '(207) 376-2739'
        },
        headers: {
          'Content-Type': 'application/json',
          'Token': token
        }
      }).then((body) => {
        body.should.have.property('id')
        body.id.should.equal(contactId.redhood)
      })
    })
    it('#POST(2)', () => {
      return rp({
        method: 'POST',
        uri: 'http://127.0.0.1:' + config.port + '/contacts/' + contactId.redhood + '/entries',
        json: true,
        body: {
          'phone': '+447769681667'
        },
        headers: {
          'Content-Type': 'application/json',
          'Token': token
        }
      }).then((body) => {
        body.should.have.property('id')
        body.id.should.equal(contactId.redhood)
      })
    })
  })
  describe('Final Check', () => {
    it('Do we have the Red Hood\'s phone number?', () => {
      return rp({
        method: 'GET',
        uri: 'http://127.0.0.1:' + config.port + '/contacts',
        json: true,
        headers: {
          'Content-Type': 'application/json',
          'Token': token
        }
      }).then((body) => {
        chai.assert(Array.isArray(body) && body.length === 1, 'The array exists and is the correct length.')
        chai.assert(body[0].first_name === 'Red' || body[0].last_name === 'Hood', 'The contact is the Red Hood.')
        chai.assert(Array.isArray(body[0].phones) && body[0].phones.length === 2, 'The phones array exists and is the correct length.')
        body[0].phones[0].should.equal('+12073762739')
        body[0].phones[1].should.equal('+447769681667')
      })
    })
    it('Clean up', () => {
      db.User.findOne({ username: 'TestUser' }).remove().exec()
      db.Contact.findOne({ _id: contactId.redhood }).remove().exec()
    })
  })
})
