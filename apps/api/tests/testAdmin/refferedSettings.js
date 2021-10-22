/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'


const faker = require('faker')

const request = require('supertest')
const referredSettings = require('../../app/models/settingReferred')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const url = process.env.URL_TEST_ADMIN
const createdID = []


module.exports = (server) => {
  describe('*********** REFERREDS_SETTINGS_ADMIN ***********', () => {
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
      }, 10000)
    })

    describe('/GET referreds_settings', () => {
      test('it should GET all the referreds', (done) => {
        request(server)
          .get(`${url}/referredSettings`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            const { docs } = body
            expect(body).toEqual(expect.objectContaining({
              docs: expect.any(Array),
              totalDocs: expect.any(Number),
              hasPrevPage: expect.any(Boolean),
              hasNextPage: expect.any(Boolean),
              totalPages: expect.any(Number),
            }))
            expect(body).toBeInstanceOf(Object)
            expect(docs).toHaveLength(2)
            done()
          })
      })
      test(
        'it should NOT be able to consume the route since no token was sent',
        (done) => {
          request(server)
            .get(`${url}/referreds`)
            .expect(401)
            .end((err, res) => {
              done()
            })
        }
      )
    })

    describe('/POST referreds_settings', () => {
      test(
        'it should NOT POST a referreds_settings without referreds_settings',
        (done) => {
          const settingsPostOne = {}
          request(server)
            .post(`${url}/referredSettings`)
            .set('Authorization', `Bearer ${token}`)
            .send(settingsPostOne)
            .expect(422)
            .end((err, res) => {
              const { body } = res
              expect(body).toBeInstanceOf(Object)
              expect(body).toHaveProperty('errors')
              const { errors } = body
              expect(errors.msg).toBeInstanceOf(Array)
              done()
            })
        }
      )
      test('it should POST a referreds_settings ', (done) => {
        const settingsPostTwo = {
          name: faker.random.words(),
          label: faker.random.words(),
          amountTo: faker.random.number(),
          amountFrom: faker.random.number()
        }
        request(server)
          .post(`${url}/referredSettings`)
          .set('Authorization', `Bearer ${token}`)
          .send(settingsPostTwo)
          .expect(201)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              name: expect.any(String),
              label: expect.any(String),
              amountTo: expect.any(Number),
            }))
            expect(body).toHaveProperty('name', settingsPostTwo.name)
            expect(body).toHaveProperty('label', settingsPostTwo.label)
            createdID.push(res.body._id)
            done()
          })
      })
    })

    describe('/GET/:id referreds_settings', () => {
      test('it should GET a referreds_settings by the given id', (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .get(`${url}/referredSettings/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((error, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              name: expect.any(String),
              amountTo: expect.any(Number),
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
            .get(`${url}/referredSettings/${id}`)
            .expect(401)
            .end((err, res) => {
              done()
            })
        }
      )
    })

    describe('/PATCH/:id referreds_settings', () => {
      test('it should UPDATE a category given the id', (done) => {
        const id = createdID.slice(-1).pop()
        const newName = faker.random.words()
        const newAmount = faker.random.number()
        request(server)
          .patch(`${url}/referredSettings/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: newName,
            label: newName,
            amountTo: newAmount,
            amountFrom: newAmount
          })
          .expect(200)
          .end((error, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
            }))
            expect(body).toHaveProperty('_id', id)
            expect(body).toHaveProperty('name', newName)
            expect(body).toHaveProperty('label', newName)
            expect(body).toHaveProperty('amountTo', newAmount)
            expect(body).toHaveProperty('amountFrom', newAmount)
            expect(typeof body._id).toBe('string')
            createdID.push(res.body._id)
            done()
          })
      })
      test('it should not UPDATE a type referred empty', (done) => {
        request(server)
          .patch(`${url}/referredSettings`)
          .set('Authorization', `Bearer ${token}`)
          .send({})
          .expect(404)
          .end((error, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            done()
          })
      })
      test(
        'it should NOT be able to consume the route since no token was sent',
        (done) => {
          const id = createdID.slice(-1).pop()
          request(server)
            .patch(`${url}/referredSettings/${id}`)
            .send({
              name: faker.random.words()
            })
            .end((err, res) => {
              done()
            })
        }
      )
    })

    describe('/DELETE/:id category', () => {
      test('it should DELETE a category given the id', (done) => {
        const typeRefferedDeleted = {
          name: faker.random.words(),
          label: faker.random.words(),
          amountTo: faker.random.number(),
          amountFrom: faker.random.number()
        }
        request(server)
          .post(`${url}/referredSettings`)
          .set('Authorization', `Bearer ${token}`)
          .send(typeRefferedDeleted)
          .expect(201)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              label: expect.any(String),
              name: expect.any(String),
              amountTo: expect.any(Number),
              amountFrom: expect.any(Number),
            }))
            request(server)
              .delete(`${url}/referredSettings/${res.body._id}`)
              .set('Authorization', `Bearer ${token}`)
              .expect(200)
              .end((error, result) => {
                const { body: newBody } = result
                expect(newBody).toBeInstanceOf(Object)
                expect(newBody).toHaveProperty('msg', 'DELETED')
                done()
              })
          })
      })
    })

    afterAll(() => {
      createdID.forEach((id) => {
        referredSettings.findByIdAndRemove(id, (err) => {
          if (err) {
            // console.log(err)
          }
        })
      })
    })
  })
}