/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const faker = require('faker')

const _ = require('lodash')
const orders = require('../../app/models/payOrder')
const reservations = require('../../app/models/reservation')
const request = require('supertest')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const createdIDReservation = []
let idReservation
let amountReservation
const price = 10000
const createdReservation = []
const TokenCard = 'tok_visa'
let idIntention = ''
const contractData = {
  id: '5fa1831e02945b26c4561774',
  payAmount: 100,
  intent: 'buyTour'
}
const pk = 'pk_test_Wj915HLpr6PpdvzQMuzq8idv'
const url = process.env.URL_TEST_USER

module.exports = (server) => {
  describe('*********** PAY_ORDERS_USERS ***********', () => {
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
      }, 1000)
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
    describe('/POST reservations', () => {
      test('it should POST a contracts 100 percentage', (done) => {
        request(server)
          .post(`${url}/contracts`)
          .set('Authorization', `Bearer ${token}`)
          .send(contractData)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            idIntention = body._id
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('percentage', contractData.payAmount)
            expect(body).toHaveProperty('idOperation', contractData.id)
            done()
          })
      })
      test('it should POST a reservations ', (done) => {
        const fackEmail = 'pepito@gmail.com'
        const reservationsPost = {
          travelerFirstName: faker.random.words(),
          travelerLastName: faker.random.words(),
          travelerEmail: fackEmail,
          travelerPhone: {
            number: '+57 314 3605160',
            code: 'CO'
          },
          travelerDocument: faker.random.word(),
          travelerAddress: faker.random.word(),
          travelerBirthDay: '02-10-2020',
          travelerGender: 'M',
          country: faker.random.word(),
          city: faker.random.word(),
          idIntention
        }
        request(server)
          .post(`${url}/reservations`)
          .set('Authorization', `Bearer ${token}`)
          .send(reservationsPost)
          .expect(201)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              status: expect.any(String),
              amount: expect.any(Number),
              code: expect.any(String),
            }))
            expect(body).toHaveProperty('amount', 980.1)
            expect(body).toHaveProperty('status', 'pending')
            expect(body).toHaveProperty('travelerEmail', fackEmail)
            idReservation = body._id
            amountReservation = body.amount
            createdReservation.push(body._id)
            done()
          })
      })
    })

    describe('/POST payment', () => {
      test('it should NOT POST payment reservation with wallet', (done) => {
        const orderPost = {
          idReservation,
          amount: 500
        }
        request(server)
          .post(`${url}/payorders`)
          .set('Authorization', `Bearer ${token}`)
          .send(orderPost)
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            const { errors } = body
            expect(errors).toHaveProperty('msg', 'Amount Error')
            done()
          })
      }, 2000)

      test('it should POST to save money in wallet 10000', (done) => {
        const orderPost = {
          token: TokenCard,
          amount: price,
          pk
        }
        request(server)
          .post(`${url}/stripe`)
          .set('Authorization', `Bearer ${token}`)
          .send(orderPost)
          .expect(201)
          .end((err, res) => {
            expect(res.body).toBeInstanceOf(Object)
            const customData = res.body
            request(server)
              .patch(`${url}/payorders/${res.body.id}`)
              .set('Authorization', `Bearer ${token}`)
              .send(customData)
              .expect(200)
              .end((error, result) => {
                const { body } = result
                expect(body).toBeInstanceOf(Object)
                expect(body).toEqual(expect.objectContaining({
                  _id: expect.any(String),
                  idOperation: expect.any(String),
                }))
                expect(body).toHaveProperty('status', 'succeeded')
                expect(body).toHaveProperty('idOperation', res.body.id)
                expect(body).toHaveProperty('amount', price)
                done()
              })
          })
      }, 5000)

      test('it should GET Total in wallet', (done) => {
        request(server)
          .get(`${url}/wallets`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            const first = _.head(body.docs)
            expect(body.docs).toHaveLength(1)
            expect(body).toEqual(expect.objectContaining({
              docs: expect.any(Array),
              total: expect.any(Number),
            }))
            expect(first).toEqual(expect.objectContaining({
              amount: expect.any(Number),
            }))
            done()
          })
      }, 2000)

      test('it should POST payment with wallet', (done) => {
        const orderPost = {
          idReservation,
          amount: amountReservation
        }
        request(server)
          .post(`${url}/payorders`)
          .set('Authorization', `Bearer ${token}`)
          .send(orderPost)
          .expect(201)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('amount', amountReservation)
            expect(body).toHaveProperty('status', 'succeeded')
            done()
          })
      }, 5000)
    })

    afterAll(() => {
      orders.deleteMany({}, (err) => {
        if (err) {
          console.log(err.message)
        }
      })
      createdIDReservation.forEach((id) => {
        reservations.findByIdAndRemove(id, (err) => {
          if (err) {
            console.log(err.message)
          }
        })
      })
    })
  })
}