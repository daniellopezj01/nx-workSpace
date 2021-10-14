/* eslint-disable handle-callback-err */
/* eslint-disable max-len */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const User = require('../../app/models/user')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
const createdID = []
let verificationForgot = ''
const email = faker.internet.email()

const url = process.env.URL_TEST_USER
// chai.use(chaiHttp)

describe('*********** AUTH_USER ***********', () => {
  describe('/GET /', () => {
    it('it should GET home user url', (done) => {
      chai
        .request(server)
        .get(`${url}/`)
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })
  describe('/GET /404url', () => {
    it('it should GET 404 url', (done) => {
      chai
        .request(server)
        .get('/404url')
        .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.an('object')
          done()
        })
    })
  })
  describe('/POST login', () => {
    it('error login', (done) => {
      chai
        .request(server)
        .post(`${url}/login`)
        .send({ email: 'admin@admin.com', password: 'error password' })
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.have
            .property('errors')
            .eql({ msg: { msg: 'WRONG_PASSWORD' } })
          res.body.should.be.an('object')
          done()
        })
    })
    it('it should GET token', (done) => {
      chai
        .request(server)
        .post(`${url}/login`)
        .send(loginDetails)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.should.include.keys('accessToken', 'user')
          token = res.body.accessToken
          done()
        })
    })
  })
  describe('/POST register', () => {
    it('it should POST register', (done) => {
      const user = {
        name: faker.random.words(),
        surname: faker.random.words(),
        email,
        password: faker.random.words()
      }
      chai
        .request(server)
        .post(`${url}/register`)
        .send(user)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.should.include.keys('accessToken', 'user')
          body.user.should.have.property('email').eql(email.toLowerCase())
          createdID.push(res.body.user._id)
          done()
        })
    })
    it('it should NOT POST a register empty values', (done) => {
      const user = {
        surname: faker.random.words()
      }
      chai
        .request(server)
        .post(`${url}/register`)
        .send(user)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.a('object')
          body.should.have.property('errors')
          const { errors } = body
          errors.should.have.property('msg').be.a('array')
          done()
        })
    })
    it('it should NOT POST a register if email already exists', (done) => {
      const user = {
        name: faker.random.words(),
        surname: faker.random.words(),
        email,
        password: faker.random.words()
      }
      chai
        .request(server)
        .post(`${url}/register`)
        .send(user)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.a('object')
          body.should.have.property('errors')
          const { msg } = body.errors
          const message = `E11000 duplicate key error collection: oauth_service.users index: email_1 dup key: { email: "${email.toLowerCase()}" }`
          msg.should.have.property('msg').eql(message)
          done()
        })
    })
  })
  describe('/POST forgot', () => {
    it('it should Error  POST forgot', (done) => {
      chai
        .request(server)
        .post(`${url}/forgot`)
        .send({
          email: faker.internet.email()
        })
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.an('object')
          body.should.have.property('errors')
          body.errors.should.have
            .property('msg')
            .eql({ msg: 'USER_DOES_NOT_EXIST' })
          verificationForgot = res.body.verification
          done()
        })
    })
    it('it should POST forgot', (done) => {
      const object = {
        email
      }
      chai
        .request(server)
        .post(`${url}/forgot`)
        .send(object)
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
    it('it should POST reset', (done) => {
      chai
        .request(server)
        .post(`${url}/reset`)
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
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      chai
        .request(server)
        .get(`${url}/token`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
    it('it should GET a fresh token', (done) => {
      chai
        .request(server)
        .post(`${url}/exchange`)
        .send({
          accessToken: token
        })
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.should.include.keys('token', 'user')
          done()
        })
    })
  })
  after(() => {
    createdID.forEach((id) => {
      User.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
