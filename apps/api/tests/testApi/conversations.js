/* eslint-disable max-statements */
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const _ = require('lodash')
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const conversation = require('../../app/models/conversation')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
const createdID = []
/** message */

const existHash = '0Je0su8WqkndG_Qe2foaz'
const toUser1 = '5aa1c2c35ef7a4e97b5e995b'
const toUser2 = '5fa29a9584b39b13786fbfc2'

const url = process.env.URL_TEST_USER

chai.use(chaiHttp)

describe('*********** CONVERSATIONS_USER ***********', () => {
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

  describe('/GET conversations', () => {
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      chai
        .request(server)
        .get(`${url}/conversations`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
    it('it should GET all the conversations', (done) => {
      chai
        .request(server)
        .get(`${url}/conversations`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200)
          const { body } = res
          // res.body.should.have.lengthOf(1)
          body.docs.should.be.a('array')
          body.limit.should.be.a('number')
          body.page.should.be.a('number')
          body.pagingCounter.should.be.a('number')
          body.totalDocs.should.be.a('number')
          body.totalPages.should.be.a('number')
          const { docs } = body
          const firstChat = _.head(docs)
          firstChat.should.include.keys(
            '_id',
            'members',
            'type',
            'hash',
            'createdAt',
            'updatedAt',
            'messages',
            'toFrom',
            'firstMessage'
          )
          firstChat._id.should.be.a('string')
          firstChat.members.should.be.a('array')
          firstChat.type.should.be.a('string')
          firstChat.hash.should.be.a('string')
          firstChat.messages.should.be.a('array')
          firstChat.toFrom.should.be.a('object')
          firstChat.firstMessage.should.be.a('object')
          done()
        })
    })
    it('it should not  GET conversations by hash', (done) => {
      chai
        .request(server)
        .get(`${url}/conversations/noexiste`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.an('object')
          res.body.should.have.property('errors').eql({ msg: 'NOT_FOUND' })
          done()
        })
    })
  })

  describe('/POST To new Conversation', () => {
    it('error in params', (done) => {
      const messagePost = {
        message: faker.random.words()
      }
      chai
        .request(server)
        .post(`${url}/messages/false`)
        .set('Authorization', `Bearer ${token}`)
        .send(messagePost)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          // res.body.should.include.property('errors').eql({ msg: 'BODY_INCOMPLETE' })
          createdID.push(res.body.idConversation)
          done()
        })
    })
    it('it should POST to with hash', (done) => {
      const messagePost = {
        message: faker.random.words(),
        to: toUser1
      }
      chai
        .request(server)
        .post(`${url}/messages/${existHash}`)
        .set('Authorization', `Bearer ${token}`)
        .send(messagePost)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(201)
          body.should.be.a('object')
          body.should.include.keys('_id', 'hash')
          body.should.include.property('hash').eql(existHash)
          body._id.should.be.a('string')
          body.members.should.be.a('array')
          body.type.should.be.a('string')
          body.hash.should.be.a('string')
          body.createdAt.should.be.a('string')
          body.updatedAt.should.be.a('string')
          body.messages.should.be.a('array')
          const lastMessage = _.last(body.messages)
          lastMessage.should.have.property('message').eql(messagePost.message)
          createdID.push(res.body._id)
          done()
        })
    })
    it('new Conversation', (done) => {
      const messagePost = {
        message: faker.random.words(),
        to: toUser2
      }
      chai
        .request(server)
        .post(`${url}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .send(messagePost)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(201)
          body.should.be.a('object')
          body.should.include.keys('_id', 'hash')
          body._id.should.be.a('string')
          body.members.should.be.a('array')
          body.type.should.be.a('string')
          body.hash.should.be.a('string')
          body.createdAt.should.be.a('string')
          body.updatedAt.should.be.a('string')
          body.messages.should.be.a('array')
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET/:id conversations', () => {
    it('it should GET conversations by hash', (done) => {
      chai
        .request(server)
        .get(`${url}/conversations/${existHash}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.should.have.property('hash').eql(existHash)
          body._id.should.be.a('string')
          body.members.should.be.a('array')
          body.type.should.be.a('string')
          body.hash.should.be.a('string')
          body.createdAt.should.be.a('string')
          body.updatedAt.should.be.a('string')
          body.messages.should.be.a('array')
          done()
        })
    })
  })

  after(() => {
    createdID.forEach((id) => {
      conversation.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
