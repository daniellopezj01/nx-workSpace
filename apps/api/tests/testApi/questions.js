/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const _ = require('lodash')
const chai = require('chai')
const chaiHttp = require('chai-http')
const modalquestion = require('../../app/models/questionsReservation')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'user@user.com',
  password: '12345'
}
const createdID = []

const url = process.env.URL_TEST_USER
// chai.use(chaiHttp)

describe('*********** QUESTIONS_USER ***********', () => {
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

  describe('/GET questions', () => {
    it('it should GET all the questions', (done) => {
      chai
        .request(server)
        .get(`${url}/questions`)
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          const question = _.head(docs)
          res.should.have.status(200)
          body.should.be.an('object')
          docs.should.have.lengthOf(4)
          id = question._id
          question.should.include.keys('_id', 'status', 'title', 'question')
          done()
        })
    })
    it('it should NOT GET the questions with filters', (done) => {
      chai
        .request(server)
        .get(`${url}/questions?filter=noexiste&fields=status`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          const { body } = res
          const { docs, totalDocs } = body
          totalDocs.should.be.a('number')
          body.should.have.property('totalDocs').eql(0)
          docs.should.have.lengthOf(0)
          done()
        })
    })
    it('it should GET the questions with filters', (done) => {
      chai
        .request(server)
        .get(`${url}/questions?filter=public&fields=status`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          const { body } = res
          const { docs } = body
          const question = _.head(docs)
          body.should.be.an('object')
          docs.should.have.lengthOf(3)
          question.should.include.keys('_id', 'title', 'question')
          question.should.have.property('status').eql('public')
          done()
        })
    })
  })
  after(() => {
    createdID.forEach((idquestion) => {
      modalquestion.findByIdAndRemove(idquestion, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
