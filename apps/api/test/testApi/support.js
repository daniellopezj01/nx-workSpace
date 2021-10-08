/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const _ = require('lodash')
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const support = require('../../app/models/supportTicket')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const createdID = []
/** message */

const codeReservation = '665-446'
const hash = 'YPp_bWfeEWQV'

const url = process.env.URL_TEST_USER

chai.use(chaiHttp)

describe('*********** SUPPORT_USERS ***********', () => {
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
  describe('/GET support', () => {
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      chai
        .request(server)
        .post(`${url}/support`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
    it('it should GET all the support', (done) => {
      chai
        .request(server)
        .get(`${url}/support/${codeReservation}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200)
          const { body } = res
          body.docs.should.be.a('array')
          body.totalDocs.should.be.a('number').eql(1)
          const { docs } = body
          const firstChat = _.head(docs)
          firstChat.should.include.keys(
            '_id',
            'status',
            'hash',
            'firstMessage',
            'codeReservation'
          )
          firstChat._id.should.be.a('string')
          firstChat.hash.should.be.a('string').eql(hash)
          firstChat.codeReservation.should.be.a('string').eql(codeReservation)
          done()
        })
    })
    it('it should not  GET support by codeReservation', (done) => {
      chai
        .request(server)
        .get(`${url}/support/6035014000c0712dcc000368`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200)
          const { body } = res
          body.should.be.an('object')
          body.should.have.property('docs')
          const { docs } = body
          docs.should.be.an('array')
          docs.should.have.length(0)
          done()
        })
    })
  })

  describe('/POST To new support', () => {
    it('error in params', (done) => {
      const messagePost = {
        message: faker.random.words()
      }
      chai
        .request(server)
        .post(`${url}/support`)
        .set('Authorization', `Bearer ${token}`)
        .send(messagePost)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.a('object')
          body.should.have.property('errors')
          done()
        })
    })
    // it('it should POST to without hash', (done) => {
    //   const messagePost = {
    //     message: faker.random.words(),
    //     codeReservation
    //   }
    //   chai
    //     .request(server)
    //     .post(`${url}/support`)
    //     .set('Authorization', `Bearer ${token}`)
    //     .send(messagePost)
    //     .end((err, res) => {
    //       const { body } = res
    //       res.should.have.status(200)
    //       body.should.be.a('object')
    //       body.should.include.keys('_id', 'hash')
    //       body._id.should.be.a('string')
    //       body.hash.should.be.a('string')
    //       body.codeReservation.should.be.a('string').eql(codeReservation)
    //       body.messages.should.be.a('array').length(1)
    //       const lastMessage = _.last(body.messages)
    //       lastMessage.should.have.property('message').eql(messagePost.message)
    //       createdID.push(res.body._id)
    //       done()
    //     })
    // })
    it('it should POST to with hash', (done) => {
      const messagePost = {
        message: faker.random.words(),
        codeReservation,
        hash
      }
      chai
        .request(server)
        .post(`${url}/support`)
        .set('Authorization', `Bearer ${token}`)
        .send(messagePost)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.include.keys('_id', 'hash')
          body.should.include.property('hash').eql(hash)
          body._id.should.be.a('string')
          body.hash.should.be.a('string')
          // body.messages.should.be.a('array').length(2)
          body.codeReservation.should.be.a('string').eql(codeReservation)
          const lastMessage = _.last(body.messages)
          lastMessage.should.have.property('message').eql(messagePost.message)
          createdID.push(res.body._id)
          done()
        })
    })
    it('new support', (done) => {
      const messagePost = {
        message: faker.random.words(),
        codeReservation
      }
      chai
        .request(server)
        .post(`${url}/support`)
        .set('Authorization', `Bearer ${token}`)
        .send(messagePost)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.include.keys('_id', 'hash')
          body._id.should.be.a('string')
          body.hash.should.be.a('string')
          body.messages.should.be.a('array').length(1)
          const lastMessage = _.last(body.messages)
          lastMessage.should.have.property('message').eql(messagePost.message)
          body.codeReservation.should.be.a('string').eql(codeReservation)
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET/: support currentChat', () => {
    const object = {
      codeReservation,
      hash
    }
    it('it should GET support by hash', (done) => {
      chai
        .request(server)
        .post(`${url}/support/currentChat`)
        .set('Authorization', `Bearer ${token}`)
        .send(object)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.should.include.keys('_id', 'hash')
          body.should.have.property('hash').eql(hash)
          // body.messages.should.be.a('array').length(2)
          body.codeReservation.should.be.a('string').eql(codeReservation)
          createdID.push(res.body._id)
          done()
        })
    })
  })

  after(() => {
    createdID.forEach((id) => {
      support.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
