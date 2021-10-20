/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const _ = require('lodash')
const faker = require('faker')


const orders = require('../../app/models/payOrder')
const server = require('../../superTest')
const request = require('supertest')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const createdID = []
const idReservation = '5fa18bde4087883d305e6800'
const idUser = '5aa1c2c35ef7a4e97b5e995a'
const url = process.env.URL_TEST_ADMIN


describe('*********** PAY_ORDERS_ADMIN ***********', () => {
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

  describe('/POST payOrders', () => {
    test('it should NOT POST a orders without orders', (done) => {
      const orderPostOne = {}
      request(server)
        .post(`${url}/payOrders`)
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
    test('it should POST a orders  pay Wallet', (done) => {
      const orderPostTwo = {
        idOperation: faker.random.words(),
        amount: faker.random.number(),
        idUser,
        platform: 'stripe'
      }
      request(server)
        .post(`${url}/payOrders`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPostTwo)
        .expect(201)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            idUser: expect.any(String),
            platform: expect.any(String),
            idOperation: expect.any(String),
          }))
          expect(body).toHaveProperty('platform', 'stripe')
          expect(body).toHaveProperty('idUser', idUser)
          expect(body).toHaveProperty('amount', orderPostTwo.amount)
          createdID.push(res.body._id)
          done()
        })
    })
    test('it should POST a orders pay reservation', (done) => {
      const orderPostTwo = {
        idReservation,
        idOperation: faker.random.words(),
        amount: faker.random.number(),
        idUser,
        platform: 'stripe'
      }
      request(server)
        .post(`${url}/payOrders`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPostTwo)
        .expect(201)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            idUser: expect.any(String),
            platform: expect.any(String),
            idOperation: expect.any(String),
          }))
          expect(body).toHaveProperty('platform', 'stripe')
          expect(body).toHaveProperty('idReservation', idReservation)
          expect(body).toHaveProperty('amount', orderPostTwo.amount)
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET payOrders', () => {
    test('it should GET all the payOrders', (done) => {
      request(server)
        .get(`${url}/payOrders`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          expect(body).toBeInstanceOf(Object)
          expect(docs).toHaveLength(2)
          const firstorder = _.head(docs)
          expect(firstorder).toEqual(expect.objectContaining({
            _id: expect.any(String),
            amount: expect.any(Number),
            idOperation: expect.any(String),
          }))
          done()
        })
    })
  })

  describe('/GET/:id payOrders', () => {
    test('it should GET a payOrders by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .get(`${url}/payOrders/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            status: expect.any(String),
            _id: expect.any(String),
            idReservation: expect.any(String),
          }))
          expect(body).toHaveProperty('_id', id)
          done()
        })
    })
    test('it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .get(`${url}/payOrders/${id}`)
          .expect(401)
          .end((err, res) => {
            done()
          })
      }
    )
  })

  describe('/PATCH/:id payOrders', () => {
    test('it should UPDATE a orders given the id', (done) => {
      const id = createdID.slice(-1).pop()
      const object = { amount: faker.random.number() }
      request(server)
        .patch(`${url}/payOrders/fromPanel/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(object)
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('_id', id)
          expect(body).toHaveProperty('amount', object.amount)
          done()
        })
    })
    test(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .patch(`${url}/payOrders/fromPanel/${id}`)
          .send({
            amount: faker.random.number()
          })
          .expect(401)
          .end((err, res) => {
            done()
          })
      }
    )
  })

  describe('/DELETE/:id orders', () => {
    test('it should DELETE a orders given the id', (done) => {
      const objectDelete = {
        idReservation,
        idOperation: faker.random.words(),
        amount: faker.random.number(),
        idUser,
        platform: 'stripe'
      }
      request(server)
        .post(`${url}/payOrders`)
        .set('Authorization', `Bearer ${token}`)
        .send(objectDelete)
        .expect(201)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            platform: expect.any(String),
            _id: expect.any(String),
            idOperation: expect.any(String),
            idUser: expect.any(String),
          }))
          request(server)
            .delete(`${url}/payOrders/${body._id}`)
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
      orders.findByIdAndRemove(id, (err) => {
        if (err) {
          console.log(err.message)
        }
      })
    })
  })
})
