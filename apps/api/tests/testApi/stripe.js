/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
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



describe('*********** STRIPE_USERS ***********', () => {
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

  describe('/POST stripe', () => {
    test('it should NOT POST  without params', (done) => {
      const orderPost = {
        token: TokenCard
      }
      request(server)
        .post(`${url}/stripe`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPost)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(errors).toBeInstanceOf(Object)
          expect(errors.msg).be.a('array').toHaveLength(2)
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
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(201)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['id', 'client_secret', 'amount']))
          const { description, amount } = body
          expect(amount).be.a('number').toEqual(price * 100)
          expect(description).be.a('string').toBe('Abono a monedero')
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
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(errors).toBeInstanceOf(Object)
          expect(errors.msg).be.a('array').toHaveLength(2)
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
        .end((err, res) => {
          expect(res).have.status(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body.amount).be.a('number').toEqual(price * 100)
          expect(res.body).toEqual(expect.arrayContaining(['id', 'client_secret']))
          customData = res.body
          chai
            .request(server)
            .patch(`${url}/payorders/${res.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(customData)
            .end((error, result) => {
              const { body } = result
              expect(result).have.status(200)
              expect(body).toBeInstanceOf(Object)
              expect(body).toEqual(expect.arrayContaining(['_id', 'idOperation', 'customData']))
              expect(body).have.property('status').toBe('succeeded')
              expect(body).have.property('idOperation').toEqual(res.body.id)
              expect(body).toBeInstanceOf(Number)
              expect(body).have.property('amount').toEqual(price)
              done()
            })
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .post(`${url}/stripe`)
          .send({
            token: TokenCard,
            reference: reservation._id,
            amount: price
          })
          .end((err, res) => {
            expect(res).have.status(401)
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
