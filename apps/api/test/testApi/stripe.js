/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
const payOrders = require('../../app/models/payOrder')

// eslint-disable-next-line no-unused-vars
const should = chai.should()
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

chai.use(chaiHttp)

describe('*********** STRIPE_USERS ***********', () => {
  describe('/POST login', () => {
    it('it should GET token user', (done) => {
      chai
        .request(server)
        .post(`${url}/login`)
        .send(loginDetails)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.include.keys('accessToken', 'user')
          const currentAccessToken = res.body.accessToken
          accessToken = currentAccessToken
          done()
        })
    })
    it('it should GET a fresh token', (done) => {
      chai
        .request(server)
        .post(`${url}/exchange`)
        .send({
          accessToken
        })
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.should.include.keys('token', 'user')
          const currentToken = body.token
          token = currentToken
          done()
        })
    })
  })

  describe('/POST stripe', () => {
    it('it should NOT POST  without params', (done) => {
      const orderPost = {
        token: TokenCard
      }
      chai
        .request(server)
        .post(`${url}/stripe`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPost)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.a('object')
          body.should.have.property('errors')
          const { errors } = body
          errors.should.be.a('object')
          errors.msg.should.be.a('array').length(2)
          // errors.should.have.property('msg').eql('Invalid integer: NaN')
          done()
        })
    })
    it('it should POST a Stripe with amount ', (done) => {
      const orderPost = {
        token: TokenCard,
        amount: price,
        pk
      }
      chai
        .request(server)
        .post(`${url}/stripe`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPost)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(201)
          body.should.be.a('object')
          body.should.include.keys('id', 'client_secret', 'amount')
          const { description, amount } = body
          amount.should.be.a('number').eql(price * 100)
          description.should.be.a('string').eql('Abono a monedero')
          done()
        })
    })
    it('it should NOT POST error params', (done) => {
      const orderPost = {
        token: TokenCard,
        reference: reservation._id
      }
      chai
        .request(server)
        .post(`${url}/stripe`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPost)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.a('object')
          body.should.have.property('errors')
          const { errors } = body
          errors.should.be.a('object')
          errors.msg.should.be.a('array').length(2)
          // errors.should.have.property('msg').eql('Invalid integer: NaN')
          done()
        })
    })
    it('it should POST a Stripe with Reservation ', (done) => {
      const orderPost = {
        token: TokenCard,
        reference: reservation._id,
        amount: price,
        pk
      }
      chai
        .request(server)
        .post(`${url}/stripe`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPost)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.amount.should.be.a('number').eql(price * 100)
          res.body.should.include.keys('id', 'client_secret')
          customData = res.body
          chai
            .request(server)
            .patch(`${url}/payorders/${res.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(customData)
            .end((error, result) => {
              const { body } = result
              result.should.have.status(200)
              body.should.be.a('object')
              body.should.include.keys('_id', 'idOperation', 'customData')
              body.should.have.property('status').eql('succeeded')
              body.should.have.property('idOperation').eql(res.body.id)
              body.should.have.property('amount').to.be.a('Number')
              body.should.have.property('amount').eql(price)
              done()
            })
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      chai
        .request(server)
        .post(`${url}/stripe`)
        .send({
          token: TokenCard,
          reference: reservation._id,
          amount: price
        })
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
  after(() => {
    payOrders.deleteMany({}, (err) => {
      if (err) {
        console.log(err)
      }
    })
  })
})
