/* eslint-disable no-undef */
/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const _ = require('lodash')
const faker = require('faker')


const User = require('../../app/models/user')
const server = require('../../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const url = process.env.URL_TEST_ADMIN
const publicId = '5aa1c2c35ef7a4e97b5e995a'
const email = faker.internet.email()
const createdID = []



describe('*********** USERS_ADMIN ***********', () => {
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
  describe('/GET users', () => {
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .get(`${url}/users`)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
    test('it should GET all the users', (done) => {
      request(server)
        .get(`${url}/users`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          expect(Array.isArray(res.body.docs)).toBe(true)
          done()
        })
    })
    test('it should GET the users with filters', (done) => {
      request(server)
        .get(`${url}/users?filter=admin@admin.com&fields=email`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).have.status(200)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(Array.isArray(body.docs)).toBe(true)
          expect(body.docs).toHaveLength(1)
          const { docs } = body
          const first = _.head(docs)
          expect(first).have.property('email').toBe('admin@admin.com')
          done()
        })
    })
    test('it should GET public profile', (done) => {
      request(server)
        .get(`${url}/users/public/${publicId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('id').toEqual(publicId)
          done()
        })
    })
  })
  describe('/POST user', () => {
    test('it should NOT POST a user without name', (done) => {
      const user = {}
      request(server)
        .post(`${url}/users`)
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          done()
        })
    })
    test('it should POST a user ', (done) => {
      const user = {
        name: faker.random.words(),
        surname: faker.random.words(),
        document: faker.random.words(),
        status: 'enabled',
        email,
        password: faker.random.words(),
        role: 'user',
        phone: faker.random.words(),
        description: faker.random.words(),
        gender: 'O',
        birthDate: '01-01-1996'
      }
      request(server)
        .post(`${url}/users`)
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .end((err, res) => {
          expect(res).have.status(200)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'name', 'email', 'verification']))
          const tokenpost = body.accessToken
          request(server)
            .post(`${url}/exchange`)
            .send({
              accessToken: tokenpost
            })
            .end((error, response) => {
              expect(response).have.status(200)
              expect(response.body).toBeInstanceOf(Object)
              expect(response.body).toEqual(expect.arrayContaining(['token', 'user']))
              createdID.push(response.body.user._id)
              done()
            })
        })
    })
  })
  describe('/GET/:id user', () => {
    test('it should GET a user by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .get(`${url}/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty('name')
          expect(res.body).have.property('_id').toEqual(id)
          done()
        })
    })
  })
  describe('/GET/PAYMENTS:id user', () => {
    test('it should GET all transaction in wallet', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .get(`${url}/users/payment/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          const { docs } = body
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(docs).be.a('array').toHaveLength(0)
          expect(body).have.property('total').toBe(0)
          expect(body).have.property('total').toBe(0)
          done()
        })
    })
  })
  describe('/PATCH/:id user', () => {
    test('it should UPDATE a user given the id', (done) => {
      const id = createdID.slice(-1).pop()
      const user = {
        name: 'JS123456',
        email: 'emailthatalreadyexists@email.com',
        urlTwitter: faker.internet.url(),
        urlGitHub: faker.internet.url(),
        phone: faker.phone.phoneNumber(),
        city: faker.random.words(),
        country: faker.random.words(),
        avatar: faker.internet.url(),
        video: faker.internet.url(),
        birthDate: '01-01-2001'
      }
      request(server)
        .patch(`${url}/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('_id').toEqual(id)
          expect(body).have.property('name').toBe('JS123456')
          expect(body).have
            .property('email').toBe('emailthatalreadyexists@email.com')
          createdID.push(res.body._id)
          done()
        })
    })
    test('it should NOT UPDATE a user with email that already exists', (done) => {
      const id = createdID.slice(-1).pop()
      const user = {
        name: faker.random.words(),
        email: 'admin@admin.com',
        role: 'admin'
      }
      request(server)
        .patch(`${url}/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .end((err, res) => {
          expect(res).have.status(422)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty('errors')
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
