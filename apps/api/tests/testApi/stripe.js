/* eslint-disable camelcase */
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'



const request = require('supertest')
const payOrders = require('../../app/models/payOrder')

const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}

let customData = ''
let token = ''
const pk = 'pk_test_Wj915HLpr6PpdvzQMuzq8idv'

const url = process.env.URL_TEST_USER

// const codeReservation = '665-446'
const reservation = { _id: '5fa18bde4087883d305e6800' }
const price = 100
const TokenCard = 'tok_visa'


module.exports = (server) => {
  describe('*********** STRIPE_USERS ***********', () => {
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

    describe('/POST stripe', () => {
      test('it should NOT POST  without params', (done) => {
        const orderPost = {
          token: TokenCard
        }
        request(server)
          .post(`${url}/stripe`)
          .set('Authorization', `Bearer ${token}`)
          .send(orderPost)
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            const { errors } = body
            expect(errors.msg).toBeInstanceOf(Array)
            // errors.should.have.property('msg').eql('Invalid integer: NaN')
            done()
          })
      })
      test('it should POST a Stripe with amount ', (done) => {
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
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              id: expect.any(String),
              client_secret: expect.any(String),
              amount: expect.any(Number),
            }))
            // expect(body).toEqual(expect.arrayContaining(['id', 'client_secret', 'amount']))
            const { description, amount } = body
            expect(amount).toEqual(price * 100)
            expect(description).toEqual('Abono a monedero')
            done()
          })
      })
      test('it should NOT POST error params', (done) => {
        const orderPost = {
          token: TokenCard,
          reference: reservation._id
        }
        request(server)
          .post(`${url}/stripe`)
          .set('Authorization', `Bearer ${token}`)
          .send(orderPost)
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            const { errors } = body
            expect(errors).toBeInstanceOf(Object)
            expect(errors.msg).toHaveLength(2)
            // errors.should.have.property('msg').eql('Invalid integer: NaN')
            done()
          })
      })
      test('it should POST a Stripe with Reservation ', (done) => {
        const orderPost = {
          token: TokenCard,
          reference: reservation._id,
          amount: price,
          pk
        }
        request(server)
          .post(`${url}/stripe`)
          .set('Authorization', `Bearer ${token}`)
          .send(orderPost)
          .expect(201)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              id: expect.any(String),
              client_secret: expect.any(String),
              amount: expect.any(Number),
            }))
            expect(body.amount).toEqual(price * 100)
            customData = res.body
            request(server)
              .patch(`${url}/payorders/${res.body.id}`)
              .set('Authorization', `Bearer ${token}`)
              .send(customData)
              .expect(200)
              .end((error, result) => {
                const { body: newBody } = result
                expect(newBody).toBeInstanceOf(Object)
                expect(newBody).toEqual(expect.objectContaining({
                  _id: expect.any(String),
                  idOperation: expect.any(String),
                  customData: expect.any(Object),
                }))
                expect(newBody).toHaveProperty('status', 'succeeded')
                expect(newBody).toHaveProperty('idOperation', res.body.id)
                expect(newBody).toHaveProperty('amount', price)
                done()
              })
          })
      }, 10000)
      test(
        'it should NOT be able to consume the route since no token was sent',
        (done) => {
          request(server)
            .post(`${url}/stripe`)
            .send({
              token: TokenCard,
              reference: reservation._id,
              amount: price
            })
            .expect(401)
            .end((err, res) => {
              done()
            })
        }
      )
    })
    afterAll(() => {
      payOrders.deleteMany({}, (err) => {
        if (err) {
          console.log(err)
        }
      })
    })
  })
}
