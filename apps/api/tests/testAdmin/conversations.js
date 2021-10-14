/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

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

const toUser2 = '5fa29a9584b39b13786fbfc2'

const url = process.env.URL_TEST_ADMIN

// chai.use(chaiHttp)

describe('*********** CONVERSATIONS_ADMIN ***********', () => {
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

  describe('/DELETE/:id conversation', () => {
    it('it should DELETE a conversation given the id', (done) => {
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
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys('_id', 'hash', 'messages')
          chai
            .request(server)
            .delete(`${url}/conversations/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((error, result) => {
              const { body } = result
              result.should.have.status(200)
              body.should.be.a('object')
              body.should.have.property('msg').eql('DELETED')
              done()
            })
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
