/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const _ = require('lodash')
const faker = require('faker')
const questions = require('../../app/models/questionsReservation')
const request = require('supertest')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const createdID = []
const url = process.env.URL_TEST_ADMIN

module.exports = (server) => {
  describe('*********** QUESTIONS_ADMIN ***********', () => {
    describe('/POST login', () => {
      test('it should GET token user', (done) => {
        request(server)
          .post(`${url}/login/`)
          .send(loginDetails)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              accessToken: expect.any(String),
              user: expect.any(Object),
            }))
            const currentAccessToken = body.accessToken
            accessToken = currentAccessToken
            done()
          })
      })
      test('it should GET a fresh token', (done) => {
        request(server)
          .post(`${url}/exchange/`)
          .send({
            accessToken
          })
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              token: expect.any(String),
              user: expect.any(Object),
            }))
            const currentToken = body.token
            token = currentToken
            done()
          })
      }, 1500)
    })
    describe('/POST questions', () => {
      test('it should NOT POST a questions without questions', (done) => {
        const orderPostOne = {}
        request(server)
          .post(`${url}/questions`)
          .set('Authorization', `Bearer ${token}`)
          .send(orderPostOne)
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            const { errors } = body
            expect(errors.msg).toBeInstanceOf(Array)
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
          .expect(201)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              question: expect.any(String)
            }))
            expect(body).toHaveProperty('question', questionTwo.question)
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
          .expect(200)
          .end((err, res) => {
            const { body } = res
            const { docs } = body
            const question = _.head(docs)
            expect(body).toBeInstanceOf(Object)
            expect(docs).toHaveLength(5)
            id = question._id
            expect(question).toEqual(expect.objectContaining({
              _id: expect.any(String),
              question: expect.any(String),
              title: expect.any(String),
              status: expect.any(String),
            }))
            done()
          })
      })
      test('it should NOT GET the questions with filters', (done) => {
        request(server)
          .get(`${url}/questions?filter=noexiste&fields=status`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body).toBeInstanceOf(Object)
            const { body } = res
            const { docs } = body
            expect(body).toEqual(expect.objectContaining({
              totalDocs: expect.any(Number),
              docs: expect.any(Array),
            }))
            expect(docs).toHaveLength(0)
            done()
          })
      })
      test('it should GET the questions with filters', (done) => {
        request(server)
          .get(`${url}/questions?filter=public&fields=status`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body).toBeInstanceOf(Object)
            const { body } = res
            const { docs } = body
            const question = _.head(docs)
            expect(body).toBeInstanceOf(Object)
            expect(docs).toHaveLength(4)
            expect(question).toEqual(expect.objectContaining({
              _id: expect.any(String),
              question: expect.any(String),
              title: expect.any(String),
              status: expect.any(String),
            }))
            expect(question).toHaveProperty('status', 'public')
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
          .expect(200)
          .end((error, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              question: expect.any(String),
              title: expect.any(String),
              status: expect.any(String),
            }))
            expect(body).toHaveProperty('_id', id)
            done()
          })
      })
      test(
        'it should NOT be able to consume the route since no token was sent',
        (done) => {
          const id = createdID.slice(-1).pop()
          request(server)
            .get(`${url}/questions/${id}`)
            .expect(401)
            .end((err, res) => {
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
          .expect(200)
          .end((error, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('_id', id)
            expect(body).toHaveProperty('question', object.question)
            done()
          })
      })
      test(
        'it should NOT be able to consume the route since no token was sent',
        (done) => {
          const id = createdID.slice(-1).pop()
          request(server)
            .patch(`${url}/questions/${id}`)
            .send({
              question: faker.random.words()
            })
            .expect(401)
            .end((err, res) => {
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
          .expect(201)
          .end((err, res) => {
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              question: expect.any(String),
            }))
            request(server)
              .delete(`${url}/questions/${res.body._id}`)
              .set('Authorization', `Bearer ${token}`)
              .end((error, result) => {
                const { body } = result
                expect(body).toBeInstanceOf(Object)
                expect(body).toHaveProperty('msg', 'DELETED')
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
}