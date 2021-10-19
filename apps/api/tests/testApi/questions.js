/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const _ = require('lodash')


const modalquestion = require('../../app/models/questionsReservation')
const server = require('../../server')
const loginDetails = {
  email: 'user@user.com',
  password: '12345'
}
const createdID = []

const url = process.env.URL_TEST_USER


describe('*********** QUESTIONS_USER ***********', () => {
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

  describe('/GET questions', () => {
    test('it should GET all the questions', (done) => {
      request(server)
        .get(`${url}/questions`)
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          const question = _.head(docs)
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(docs).toHaveLength(4)
          id = question._id
          expect(question).toEqual(expect.arrayContaining(['_id', 'status', 'title', 'question']))
          done()
        })
    })
    test('it should NOT GET the questions with filters', (done) => {
      request(server)
        .get(`${url}/questions?filter=noexiste&fields=status`)
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
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          const { body } = res
          const { docs } = body
          const question = _.head(docs)
          expect(body).toBeInstanceOf(Object)
          expect(docs).toHaveLength(3)
          expect(question).toEqual(expect.arrayContaining(['_id', 'title', 'question']))
          expect(question).have.property('status').toBe('public')
          done()
        })
    })
  })
  afterAll(() => {
    createdID.forEach((idquestion) => {
      modalquestion.findByIdAndRemove(idquestion, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
