/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const _ = require('lodash')
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const orders = require('../../app/models/payOrder')
const server = require('../../server')
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

  describe('/POST payOrders', () => {
    test('it should NOT POST a orders without orders', (done) => {
      const orderPostOne = {}
      request(server)
        .post(`${url}/payOrders`)
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
        .end((err, res) => {
          expect(res).have.status(201)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(
            expect.arrayContaining(['_id', 'idUser', 'platform', 'idOperation', 'idUser', 'platform'])
          )
          expect(body).have.property('platform').toBe('stripe')
          expect(body).have.property('idUser').toEqual(idUser)
          expect(body).have.property('amount').toEqual(orderPostTwo.amount)
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
        .end((err, res) => {
          expect(res).have.status(201)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(
            expect.arrayContaining(['_id', 'idUser', 'platform', 'idOperation', 'idUser', 'platform'])
          )
          expect(body).have.property('platform').toBe('stripe')
          expect(body).have.property('idReservation').toEqual(idReservation)
          expect(body).have.property('amount').toEqual(orderPostTwo.amount)
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
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(docs).toHaveLength(2)
          const firstorder = _.head(docs)
          expect(firstorder).toEqual(expect.arrayContaining(['_id', 'amount', 'idOperation']))
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
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['status', '_id', 'idReservation']))
          expect(body).have.property('_id').toEqual(id)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .get(`${url}/payOrders/${id}`)
          .end((err, res) => {
            expect(res).have.status(401)
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
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('_id').toEqual(id)
          expect(body).have.property('amount').toEqual(object.amount)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .patch(`${url}/payOrders/fromPanel/${id}`)
          .send({
            amount: faker.random.number()
          })
          .end((err, res) => {
            expect(res).have.status(401)
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
        .end((err, res) => {
          expect(res).have.status(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['_id', 'idOperation', 'idUser', 'platform']))
          chai
            .request(server)
            .delete(`${url}/payOrders/${res.body._id}`)
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
      orders.findByIdAndRemove(id, (err) => {
        if (err) {
          console.log(err.message)
        }
      })
    })
  })
})
