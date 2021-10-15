/* eslint-disable handle-callback-err */
/* eslint-disable max-len */
/* eslint-disable no-undef */
// import { clear, mockUserAgent } from 'jest-useragent-mock'
process.env.NODE_ENV = 'test'

const faker = require('faker')

const server = require('../../superTest')
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

const url = process.env.URL_TEST_ADMIN

describe('*********** AUTH_ADMIN ***********', () => {
  describe('/GET /', () => {
    test('it should GET home user url', (done) => {
      request(server)
        .get(`${url}/`)
        .expect(200)
        .end((err, res) => {

          done()
        })
    })
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
    })
  })
  describe('/POST login', () => {
    test('it error login', (done) => {
      request(server)
        .post(`${url}/login/`)
        .type('form')
        .send({ email: 'admin@admin.com', password: 'error password' })
        .expect(422)
        .end((err, res) => {
          const { body } = res
          expect(body.errors).toMatchObject({ msg: { msg: 'WRONG_PASSWORD' } })
          expect(body).toBeInstanceOf(Object)
          done()
        })
    })
    test('it should GET token', (done) => {
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
          token = res.body.accessToken
          done()
        })
    })
  })
  describe('/POST register', () => {
    test('it should POST register', (done) => {
      const user = {
        name: faker.random.words(),
        surname: faker.random.words(),
        email,
        password: faker.random.words()
      }
      request(server)
        .post(`${url}/register/`)
        .send(user)
        .expect(200)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            accessToken: expect.any(String),
            user: expect.any(Object),
          }))
          // expect(body.user).toMatchObject({ 'email': email.toLowerCase() })
          expect(body.user).toHaveProperty('email', email.toLowerCase())
          createdID.push(res.body.user._id)
          done()
        })
    })
    test('it should NOT POST a register empty values', (done) => {
      const user = {
        surname: faker.random.words()
      }
      request(server)
        .post(`${url}/register/`)
        .send(user)
        .expect(422)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(errors.msg).toBeInstanceOf(Array)
          // expect(Array.isArray((errors.msg)).toBe(true)
          done()
        })
    })
    test('it should NOT POST a register if email already exists', (done) => {
      const user = {
        name: faker.random.words(),
        surname: faker.random.words(),
        email,
        password: faker.random.words()
      }
      request(server)
        .post(`${url}/register/`)
        .send(user)
        .expect(422)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { msg } = body.errors
          const message = `E11000 duplicate key error collection: oauth_service.users index: email_1 dup key: { email: "${email.toLowerCase()}" }`
          // expect(msg).have.property('msg').toEqual(message)
          expect(msg).toMatchObject({ msg: message })
          done()
        })
    })
  })
  describe('/POST forgot', () => {
    test('it should Error  POST forgot', (done) => {
      request(server)
        .post(`${url}/forgot/`)
        .send({
          email: faker.internet.email()
        })
        .expect(422)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          expect(body.errors.msg).toMatchObject({ msg: 'USER_DOES_NOT_EXIST' })
          verificationForgot = res.body.verification
          done()
        })
    })
    test('it should POST forgot', (done) => {
      request(server)
        .post(`${url}/forgot/`)
        .send({ email })
        .expect(200)
        .end((err, res) => {
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.objectContaining({
            msg: expect.any(String),
            // email: expect.any(String),
            verification: expect.any(String),
          }))
          verificationForgot = res.body.verification
          done()
        })
    })
  })
  describe('/POST reset', () => {
    test('it should POST reset', (done) => {
      request(server)
        .post(`${url}/resetAdmin/`)
        .send({
          id: verificationForgot,
          password: '12345'
        })
        .expect(200)
        .end((err, res) => {
          const { body } = res
          expect(res.body).toBeInstanceOf(Object)
          expect(body.msg).toEqual('PASSWORD_CHANGED')
          // expect(res.body).have.property('msg').toBe('PASSWORD_CHANGED')
          done()
        })
    })
  })
  describe('/GET token', () => {
    test('it should NOT be able to consume the route since no token was sent', (done) => {
      request(server)
        .get(`${url}/token/`)
        .expect(401)
        .end((err, res) => {
          done()
        })
    }
    )
    test('it should GET a fresh token', (done) => {
      request(server)
        .post(`${url}/exchange/`)
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
          const currentToken = body.token
          token = currentToken
          done()
        })
    })
    test('it should GET refresh token', (done) => {
      request(server)
        .get(`${url}/token`)
        .set('Authorization', `Bearer ${token}`)
        .set('user-agent', 'test')
        .expect(200)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          console.log(body)
          expect(body).toEqual(expect.objectContaining({
            token: expect.any(String),
            user: expect.any(Object),
            settings: expect.any(Object),
          }))
          // expect(body).toEqual(expect.arrayContaining(['token', 'user', 'settings']))
          done()
        })
    })
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
