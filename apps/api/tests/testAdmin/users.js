/* eslint-disable no-undef */
/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const _ = require('lodash')
const faker = require('faker')

const User = require('../../app/models/user')
const request = require('supertest')
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


module.exports = (server) => {
  describe('*********** USERS_ADMIN ***********', () => {
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
    describe('/GET users', () => {
      test('it should NOT be able to consume the route since no token was sent',
        (done) => {
          request(server)
            .get(`${url}/users`)
            .expect(401)
            .end((err, res) => {
              done()
            })
        }
      )
      test('it should GET all the users', (done) => {
        request(server)
          .get(`${url}/users`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              docs: expect.any(Array),
            }))
            done()
          })
      })
      test('it should GET the users with filters', (done) => {
        request(server)
          .get(`${url}/users?filter=admin@admin.com&fields=email`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              docs: expect.any(Array),
            }))
            expect(body.docs).toHaveLength(1)
            const { docs } = body
            const first = _.head(docs)
            expect(first).toHaveProperty('email', 'admin@admin.com')
            done()
          })
      })
      test('it should GET public profile', (done) => {
        request(server)
          .get(`${url}/users/public/${publicId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('id', publicId)
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
          .expect(422)
          .end((err, res) => {
            const { body } = res
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
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              name: expect.any(String),
              email: expect.any(String),
              verification: expect.any(String),
            }))
            const tokenpost = body.accessToken
            request(server)
              .post(`${url}/exchange`)
              .send({
                accessToken: tokenpost
              })
              .expect(200)
              .end((error, response) => {
                const { body: newBody } = response
                expect(newBody).toBeInstanceOf(Object)
                expect(newBody).toEqual(expect.objectContaining({
                  token: expect.any(String),
                  user: expect.any(Object),
                }))
                createdID.push(`${newBody.user._id}`)
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
          .expect(200)
          .end((error, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('name')
            expect(body).toHaveProperty('_id', id)
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
          .expect(200)
          .end((error, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              docs: expect.any(Array),
            }))
            expect(body).toHaveProperty('total', 0)
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
          .expect(200)
          .end((error, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('_id', id)
            expect(body).toHaveProperty('name', 'JS123456')
            expect(body).toHaveProperty('email', 'emailthatalreadyexists@email.com')
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
          .expect(422)
          .end((err, res) => {
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
}