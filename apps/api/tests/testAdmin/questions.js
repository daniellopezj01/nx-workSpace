/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const _ = require('lodash')
const faker = require('faker')


const questions = require('../../app/models/questionsReservation')
const server = require('../../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const createdID = []
const url = process.env.URL_TEST_ADMIN


describe('*********** QUESTIONS_ADMIN ***********', () => {
  describe('/POST login', () => {
    test('it should GET token user', (done) => {
      request(server)
        .post(`${url}/login`)
        .send(loginDetails)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['accessToken', 'user']))
          const currentAccessToken = res.body.accessToken
          accessToken = currentAccessToken
          done()
        })
    })
    test('it should GET a fresh token', (done) => {
      request(server)
        .post(`${url}/exchange`)
        .send({
          accessToken
        })
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['token', 'user']))
          const currentToken = body.token
          token = currentToken
          done()
        })
    })
  })

  describe('/POST questions', () => {
    test('it should NOT POST a questions without questions', (done) => {
      const orderPostOne = {}
      request(server)
        .post(`${url}/questions`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPostOne)
        .end((err, res) => {
          expect(res).have.status(422)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(Array.isArray(errors)).toBe(true)
          done()
        })
    })
    test('it should POST a questions', (done) => {
      const questionTwo = {
        question: faker.random.words()
      }
      request(server)
        .post(`${url}/questions`)
        .set('Authorization', `Bearer ${token}`)
        .send(questionTwo)
        .end((err, res) => {
          expect(res).have.status(201)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'question']))
          expect(body).have.property('question').toEqual(questionTwo.question)
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET questions', () => {
    test('it should GET all the questions', (done) => {
      request(server)
        .get(`${url}/questions`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          const question = _.head(docs)
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(docs).toHaveLength(5)
          id = question._id
          expect(question).toEqual(expect.arrayContaining(['_id', 'status', 'title', 'question']))
          done()
        })
    })
    test('it should NOT GET the questions with filters', (done) => {
      request(server)
        .get(`${url}/questions?filter=noexiste&fields=status`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          const { body } = res
          const { docs, totalDocs } = body
          expect(totalDocs).toBeInstanceOf(Number)
          expect(body).have.property('totalDocs').toBe(0)
          expect(docs).toHaveLength(0)
          done()
        })
    })
    test('it should GET the questions with filters', (done) => {
      request(server)
        .get(`${url}/questions?filter=public&fields=status`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          const { body } = res
          const { docs } = body
          const question = _.head(docs)
          expect(body).toBeInstanceOf(Object)
          expect(docs).toHaveLength(4)
          expect(question).toEqual(expect.arrayContaining(['_id', 'title', 'question']))
          expect(question).have.property('status').toBe('public')
          done()
        })
    })
  })

  describe('/GET/:id questions', () => {
    test('it should GET a questions by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .get(`${url}/questions/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          console.log(body.errors)
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['status', '_id', 'question']))
          expect(body).have.property('_id').toEqual(id)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .get(`${url}/questions/${id}`)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })

  describe('/PATCH/:id questions', () => {
    test('it should UPDATE a questions given the id', (done) => {
      const id = createdID.slice(-1).pop()
      const object = { question: faker.random.words() }
      request(server)
        .patch(`${url}/questions/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(object)
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('_id').toEqual(id)
          expect(body).have.property('question').toEqual(object.question)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .patch(`${url}/questions/${id}`)
          .send({
            question: faker.random.words()
          })
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })

  describe('/DELETE/:id questions', () => {
    test('it should DELETE a questions given the id', (done) => {
      const objectDelete = {
        question: faker.random.words()
      }
      request(server)
        .post(`${url}/questions`)
        .set('Authorization', `Bearer ${token}`)
        .send(objectDelete)
        .end((err, res) => {
          expect(res).have.status(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['_id', 'question']))
          request(server)
            .delete(`${url}/questions/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((error, result) => {
              const { body } = result
              expect(result).have.status(200)
              expect(body).toBeInstanceOf(Object)
              expect(body).have.property('msg').toBe('DELETED')
              done()
            })
        })
    })
  })

  afterAll(() => {
    createdID.forEach((id) => {
      questions.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
