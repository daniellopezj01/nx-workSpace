/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const User = require('../app/models/user')
const server = require('../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345'
}
let token = ''
const createdID = []
let verification = ''
let verificationForgot = ''
const email = faker.internet.email()



describe('*********** AUTH ***********', () => {
  describe('/GET /', () => {
    test('it should GET home API url', (done) => {
      request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })

  describe('/GET /404url', () => {
    test('it should GET 404 url', (done) => {
      request(server)
        .get('/404url')
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.an('object')
          done()
        })
    })
  })

  describe('/POST login', () => {
    test('it should GET token', (done) => {
      request(server)
        .post('/login')
        .send(loginDetails)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.have.property('token')
          const localToken = res.body.token
          token = localToken
          done()
        })
    })
  })
  describe('/POST register', () => {
    test('it should POST register', (done) => {
      const user = {
        name: faker.random.words(),
        email,
        password: faker.random.words()
      }
      request(server)
        .post('/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.an('object')
          res.body.should.include.keys('token', 'user')
          createdID.push(res.body.user._id)
          const currentVerification = res.body.user.verification
          verification = currentVerification
          done()
        })
    })
    test('it should NOT POST a register if email already exists', (done) => {
      const user = {
        name: faker.random.words(),
        email,
        password: faker.random.words()
      }
      request(server)
        .post('/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          done()
        })
    })
  })

  describe('/POST verify', () => {
    test('it should POST verify', (done) => {
      request(server)
        .post('/verify')
        .send({
          id: verification
        })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.include.keys('email', 'verified')
          res.body.verified.should.equal(true)
          done()
        })
    })
  })

  describe('/POST forgot', () => {
    test('it should POST forgot', (done) => {
      request(server)
        .post('/forgot')
        .send({
          email
        })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.include.keys('msg', 'verification')
          verificationForgot = res.body.verification
          done()
        })
    })
  })

  describe('/POST reset', () => {
    test('it should POST reset', (done) => {
      request(server)
        .post('/reset')
        .send({
          id: verificationForgot,
          password: '12345'
        })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('msg').eql('PASSWORD_CHANGED')
          done()
        })
    })
  })

  describe('/GET token', () => {
    test('it should NOT be able to consume the route since no token was sent', (done) => {
      request(server)
        .get('/token')
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
    test('it should GET a fresh token', (done) => {
      request(server)
        .get('/token')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.have.property('token')
          done()
        })
    })
  })

  after(() => {
    createdID.forEach((id) => {
      User.findByIdAndRemove(id, (err) => {
        if (err) {
          console.log(err)
        }
      })
    })
  })
})
