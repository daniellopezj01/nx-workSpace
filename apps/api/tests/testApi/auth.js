/* eslint-disable handle-callback-err */
/* eslint-disable max-len */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const faker = require('faker')


const User = require('../../app/models/user')
const server = require('../../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
const createdID = []
let verificationForgot = ''
const email = faker.internet.email()

const url = process.env.URL_TEST_USER


describe('*********** AUTH_USER ***********', () => {
  describe('/GET /', () => {
    test('it should GET home user url', (done) => {
      request(server)
        .get(`${url}/`)
        .end((err, res) => {
          expect(res).have.status(200)
          done()
        })
    })
  })
  describe('/GET /404url', () => {
    test('it should GET 404 url', (done) => {
      request(server)
        .get('/404url')
        .end((err, res) => {
          expect(res).have.status(404)
          expect(res.body).toBeInstanceOf(Object)
          done()
        })
    })
  })
  describe('/POST login', () => {
    it('error login', (done) => {
      request(server)
        .post(`${url}/login`)
        .send({ email: 'admin@admin.com', password: 'error password' })
        .end((err, res) => {
          expect(res).have.status(422)
          expect(res.body).have
            .property('errors').toEqual({ msg: { msg: 'WRONG_PASSWORD' } })
          expect(res.body).toBeInstanceOf(Object)
          done()
        })
    })
    test('it should GET token', (done) => {
      request(server)
        .post(`${url}/login`)
        .send(loginDetails)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['accessToken', 'user']))
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
        .post(`${url}/register`)
        .send(user)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['accessToken', 'user']))
          expect(body.user).have.property('email').toEqual(email.toLowerCase())
          createdID.push(res.body.user._id)
          done()
        })
    })
    test('it should NOT POST a register empty values', (done) => {
      const user = {
        surname: faker.random.words()
      }
      request(server)
        .post(`${url}/register`)
        .send(user)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(Array.isArray(errors)).toBe(true)
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
        .post(`${url}/register`)
        .send(user)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { msg } = body.errors
          const message = `E11000 duplicate key error collection: oauth_service.users index: email_1 dup key: { email: "${email.toLowerCase()}" }`
          expect(msg).have.property('msg').toEqual(message)
          done()
        })
    })
  })
  describe('/POST forgot', () => {
    test('it should Error  POST forgot', (done) => {
      request(server)
        .post(`${url}/forgot`)
        .send({
          email: faker.internet.email()
        })
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          expect(body.errors).have
            .property('msg').toEqual({ msg: 'USER_DOES_NOT_EXIST' })
          verificationForgot = res.body.verification
          done()
        })
    })
    test('it should POST forgot', (done) => {
      const object = {
        email
      }
      request(server)
        .post(`${url}/forgot`)
        .send(object)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['msg', 'verification']))
          verificationForgot = res.body.verification
          done()
        })
    })
  })
  describe('/POST reset', () => {
    test('it should POST reset', (done) => {
      request(server)
        .post(`${url}/reset`)
        .send({
          id: verificationForgot,
          password: '12345'
        })
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).have.property('msg').toBe('PASSWORD_CHANGED')
          done()
        })
    })
  })
  describe('/GET token', () => {
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .get(`${url}/token`)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
    test('it should GET a fresh token', (done) => {
      request(server)
        .post(`${url}/exchange`)
        .send({
          accessToken: token
        })
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['token', 'user']))
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
