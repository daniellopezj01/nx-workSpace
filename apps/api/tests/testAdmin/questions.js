/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const _ = require('lodash')
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const questions = require('../../app/models/questionsReservation')
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
const url = process.env.URL_TEST_ADMIN
// chai.use(chaiHttp)

describe('*********** QUESTIONS_ADMIN ***********', () => {
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

  describe('/POST questions', () => {
    it('it should NOT POST a questions without questions', (done) => {
      const orderPostOne = {}
      chai
        .request(server)
        .post(`${url}/questions`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPostOne)
        .end((err, res) => {
          res.should.have.status(422)
          const { body } = res
          body.should.be.a('object')
          body.should.have.property('errors')
          const { errors } = body
          errors.should.have.property('msg').be.a('array')
          done()
        })
    })
    it('it should POST a questions', (done) => {
      const questionTwo = {
        question: faker.random.words()
      }
      chai
        .request(server)
        .post(`${url}/questions`)
        .set('Authorization', `Bearer ${token}`)
        .send(questionTwo)
        .end((err, res) => {
          res.should.have.status(201)
          const { body } = res
          body.should.be.a('object')
          body.should.include.keys('_id', 'question')
          body.should.have.property('question').eql(questionTwo.question)
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET questions', () => {
    it('it should GET all the questions', (done) => {
      chai
        .request(server)
        .get(`${url}/questions`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          const question = _.head(docs)
          res.should.have.status(200)
          body.should.be.an('object')
          docs.should.have.lengthOf(5)
          id = question._id
          question.should.include.keys('_id', 'status', 'title', 'question')
          done()
        })
    })
    it('it should NOT GET the questions with filters', (done) => {
      chai
        .request(server)
        .get(`${url}/questions?filter=noexiste&fields=status`)
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          const { body } = res
          const { docs } = body
          const question = _.head(docs)
          body.should.be.an('object')
          docs.should.have.lengthOf(4)
          question.should.include.keys('_id', 'title', 'question')
          question.should.have.property('status').eql('public')
          done()
        })
    })
  })

  describe('/GET/:id questions', () => {
    it('it should GET a questions by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/questions/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          console.log(body.errors)
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.include.keys('status', '_id', 'question')
          body.should.have.property('_id').eql(id)
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/questions/${id}`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/PATCH/:id questions', () => {
    it('it should UPDATE a questions given the id', (done) => {
      const id = createdID.slice(-1).pop()
      const object = { question: faker.random.words() }
      chai
        .request(server)
        .patch(`${url}/questions/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(object)
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('_id').eql(id)
          body.should.have.property('question').eql(object.question)
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .patch(`${url}/questions/${id}`)
        .send({
          question: faker.random.words()
        })
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/DELETE/:id questions', () => {
    it('it should DELETE a questions given the id', (done) => {
      const objectDelete = {
        question: faker.random.words()
      }
      chai
        .request(server)
        .post(`${url}/questions`)
        .set('Authorization', `Bearer ${token}`)
        .send(objectDelete)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys('_id', 'question')
          chai
            .request(server)
            .delete(`${url}/questions/${res.body._id}`)
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
      questions.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
