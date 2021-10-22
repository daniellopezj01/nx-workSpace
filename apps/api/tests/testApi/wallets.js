/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'



const collectionPayOrder = require('../../app/models/payOrder')
const request = require('supertest')
// eslint-disable-next-line no-unused-vars
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
const price = 100
const TokenCard = 'tok_visa'
const pk = 'pk_test_Wj915HLpr6PpdvzQMuzq8idv'
const url = process.env.URL_TEST_USER


module.exports = (server) => {
  describe('*********** WALLETS_USERS ***********', () => {
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

    describe('/GET wallets', () => {
      test(
        'it should NOT be able to consume the route since no token was sent',
        (done) => {
          request(server)
            .get(`${url}/wallets`)
            .expect(4001)
            .end((err, res) => {
              done()
            })
        }
      )
      test('it should GET to wallets', (done) => {
        request(server)
          .get(`${url}/wallets`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            const { total } = body
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              docs: expect.any(Array),
              hasNextPage: expect.any(Boolean),
              hasPrevPage: expect.any(Boolean),
              limit: expect.any(Number),
              totalDocs: expect.any(Number),
            }))
            expect(total).toEqual(0)
            done()
          })
      })
    })

    describe('/POST postPayOrder', () => {
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
            expect(errors).toBeInstanceOf(Object)
            expect(errors.msg).toBeInstanceOf(Array)
            expect(errors.msg).toHaveLength(2)
            // errors[0].should.have.property('msg').eql('Invalid integer: NaN')
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
            }))
            const customData = res.body
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
                }))
                expect(newBody).toHaveProperty('status', 'succeeded')
                expect(newBody).toHaveProperty('idOperation', body.id)
                expect(newBody).toHaveProperty('amount', price)
                done()
              })
          })
      }, 10000)
    })

    afterAll(() => {
      collectionPayOrder.deleteMany({}, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
}
