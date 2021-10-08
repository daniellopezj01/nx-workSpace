/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const _ = require('lodash')
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
let accessToken = ''
const url = process.env.URL_TEST_ADMIN
const publicId = '5aa1c2c35ef7a4e97b5e995a'
const email = faker.internet.email()
const createdID = []

chai.use(chaiHttp)

describe('*********** USERS_ADMIN ***********', () => {
  describe('/POST login', () => {
    it('it should GET token user', (done) => {
      chai
        .request(server)
        .post(`${url}/login`)
        .send(loginDetails)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.include.keys('accessToken', 'user')
          const currentAccessToken = res.body.accessToken
          accessToken = currentAccessToken
          done()
        })
    })
    it('it should GET a fresh token', (done) => {
      chai
        .request(server)
        .post(`${url}/exchange`)
        .send({
          accessToken
        })
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.should.include.keys('token', 'user')
          const currentToken = body.token
          token = currentToken
          done()
        })
    })
  })
  describe('/GET users', () => {
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      chai
        .request(server)
        .get(`${url}/users`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
    it('it should GET all the users', (done) => {
      chai
        .request(server)
        .get(`${url}/users`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.docs.should.be.a('array')
          done()
        })
    })
    it('it should GET the users with filters', (done) => {
      chai
        .request(server)
        .get(`${url}/users?filter=admin@admin.com&fields=email`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200)
          const { body } = res
          body.should.be.an('object')
          body.docs.should.be.a('array')
          body.docs.should.have.lengthOf(1)
          const { docs } = body
          const first = _.head(docs)
          first.should.have.property('email').eql('admin@admin.com')
          done()
        })
    })
    it('it should GET public profile', (done) => {
      chai
        .request(server)
        .get(`${url}/users/public/${publicId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.should.have.property('id').eql(publicId)
          done()
        })
    })
  })
  describe('/POST user', () => {
    it('it should NOT POST a user without name', (done) => {
      const user = {}
      chai
        .request(server)
        .post(`${url}/users`)
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.a('object')
          body.should.have.property('errors')
          done()
        })
    })
    it('it should POST a user ', (done) => {
      const user = {
        name: faker.random.words(),
        surname: faker.random.words(),
        document: faker.random.words(),
        status: 'enabled',
        email,
        password: faker.random.words(),
        role: 'user',
        phone: faker.random.words(),
        description: faker.random.words(),
        gender: 'O',
        birthDate: '01-01-1996'
      }
      chai
        .request(server)
        .post(`${url}/users`)
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200)
          const { body } = res
          body.should.be.a('object')
          body.should.include.keys('_id', 'name', 'email', 'verification')
          const tokenpost = body.accessToken
          chai
            .request(server)
            .post(`${url}/exchange`)
            .send({
              accessToken: tokenpost
            })
            .end((error, response) => {
              response.should.have.status(200)
              response.body.should.be.an('object')
              response.body.should.include.keys('token', 'user')
              createdID.push(response.body.user._id)
              done()
            })
        })
    })
  })
  describe('/GET/:id user', () => {
    it('it should GET a user by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('name')
          res.body.should.have.property('_id').eql(id)
          done()
        })
    })
  })
  describe('/GET/PAYMENTS:id user', () => {
    it('it should GET all transaction in wallet', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/users/payment/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          const { docs } = body
          res.should.have.status(200)
          body.should.be.a('object')
          docs.should.be.a('array').length(0)
          body.should.have.property('total').eql(0)
          body.should.have.property('total').eql(0)
          done()
        })
    })
  })
  describe('/PATCH/:id user', () => {
    it('it should UPDATE a user given the id', (done) => {
      const id = createdID.slice(-1).pop()
      const user = {
        name: 'JS123456',
        email: 'emailthatalreadyexists@email.com',
        urlTwitter: faker.internet.url(),
        urlGitHub: faker.internet.url(),
        phone: faker.phone.phoneNumber(),
        city: faker.random.words(),
        country: faker.random.words(),
        avatar: faker.internet.url(),
        video: faker.internet.url(),
        birthDate: '01-01-2001'
      }
      chai
        .request(server)
        .patch(`${url}/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('_id').eql(id)
          body.should.have.property('name').eql('JS123456')
          body.should.have.property('email').eql('emailthatalreadyexists@email.com')
          createdID.push(res.body._id)
          done()
        })
    })
    it('it should NOT UPDATE a user with email that already exists', (done) => {
      const id = createdID.slice(-1).pop()
      const user = {
        name: faker.random.words(),
        email: 'admin@admin.com',
        role: 'admin'
      }
      chai
        .request(server)
        .patch(`${url}/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
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
