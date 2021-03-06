/* eslint-disable handle-callback-err */
/* eslint-disable max-len */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const faker = require('faker')

const request = require('supertest')
const User = require('../../app/models/user')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
const createdID = []
let verificationForgot = ''
const email = faker.internet.email()

const url = process.env.URL_TEST_USER


module.exports = (server) => {
  describe('*********** AUTH_USER ***********', () => {
    describe('/GET /', () => {
      test('it should GET home user url', (done) => {
        request(server)
          .get(`${url}/`)
          .expect(200)
          .end((err, res) => {
            done()
          })
      }, 1000)
    })
    describe('/GET /404url', () => {
      test('it should GET 404 url', (done) => {
        request(server)
          .get('/404url')
          .expect(404)
          .end((err, res) => {
            expect(res.body).toBeInstanceOf(Object)
            done()
          })
      }, 1000)
    })
    describe('/POST login', () => {
      test('error login', (done) => {
        request(server)
          .post(`${url}/login`)
          .send({ email: 'admin@admin.com', password: 'error password' })
          .expect(422)
          .end((err, res) => {
            expect(res.body).toHaveProperty('errors', { msg: { msg: 'WRONG_PASSWORD' } })
            expect(res.body).toBeInstanceOf(Object)
            done()
          })
      }, 1000)
      test('it should GET token', (done) => {
        request(server)
          .post(`${url}/login`)
          .send(loginDetails)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              accessToken: expect.any(String),
              user: expect.any(Object),
            }))
            token = res.body.accessToken
            done()
          })
      }, 1000)
    })
    describe('/POST register', () => {
      test('it should POST register', (done) => {
        const user = {
          name: faker.random.words(),
          surname: faker.random.words(),
          email,
          password: '123456'
        }
        request(server)
          .post(`${url}/register`)
          .send(user)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              accessToken: expect.any(String),
              user: expect.any(Object),
            }))
            expect(body.user).toHaveProperty('email', email.toLowerCase())
            createdID.push(res.body.user._id)
            done()
          })
      }, 1000)
      test('it should NOT POST a register empty values', (done) => {
        const user = {
          surname: faker.random.words()
        }
        request(server)
          .post(`${url}/register`)
          .send(user)
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            const { errors } = body
            expect(errors.msg).toBeInstanceOf(Array)
            done()
          })
      }, 1000)
      test('it should NOT POST a register if email already exists', (done) => {
        const user = {
          name: faker.random.words(),
          surname: faker.random.words(),
          email,
          password: 'sadkasnd askdjn asdkj'
        }
        request(server)
          .post(`${url}/register`)
          .send(user)
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            const { msg } = body.errors
            const message = `E11000 duplicate key error collection: oauth_service.users index: email_1 dup key: { email: "${email.toLowerCase()}" }`
            expect(msg).toHaveProperty('msg', message)
            done()
          })
      }, 1000)
    })
    describe('/POST forgot', () => {
      test('it should Error  POST forgot', (done) => {
        request(server)
          .post(`${url}/forgot`)
          .send({
            email: faker.internet.email()
          })
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            expect(body.errors).toHaveProperty('msg', { msg: 'USER_DOES_NOT_EXIST' })
            verificationForgot = res.body.verification
            done()
          })
      }, 1000)
      test('it should POST forgot', (done) => {
        const object = {
          email
        }
        request(server)
          .post(`${url}/forgot`)
          .send(object)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              msg: expect.any(String),
              verification: expect.any(String),
            }))
            verificationForgot = body.verification
            done()
          })
      }, 1000)
    })
    describe('/POST reset', () => {
      test('it should POST reset', (done) => {
        request(server)
          .post(`${url}/reset`)
          .send({
            id: verificationForgot,
            password: '12345678'
          })
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('msg', 'PASSWORD_CHANGED')
            done()
          })
      }, 1000)
    })
    describe('/GET token', () => {
      test(
        'it should NOT be able to consume the route since no token was sent',
        (done) => {
          request(server)
            .get(`${url}/token`)
            .expect(401)
            .end((err, res) => {
              done()
            })
        }, 1000)
      test('it should GET a fresh token', (done) => {
        request(server)
          .post(`${url}/exchange`)
          .send({
            accessToken: token
          })
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              token: expect.any(String),
              user: expect.any(Object),
            }))
            done()
          })
      }, 1000)
    })
    afterAll(() => {
      createdID.forEach((id) => {
        User.findByIdAndRemove(id, (err) => {
          if (err) {
            // console.log(err)
          }
        })
      })
    })
  })
}