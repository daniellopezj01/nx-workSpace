/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const orders = require('../../app/models/payOrder')
const reservations = require('../../app/models/reservation')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
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
// chai.use(chaiHttp)

describe('*********** PAY_ORDERS_USERS ***********', () => {
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
  describe('/POST reservations', () => {
    it('it should POST a contracts 100 percentage', (done) => {
      chai
        .request(server)
        .post(`${url}/contracts`)
        .set('Authorization', `Bearer ${token}`)
        .send(contractData)
        .end((err, res) => {
          res.should.have.status(200)
          const { body } = res
          idIntention = body._id
          body.should.be.a('object')
          body.should.have.property('percentage').eql(contractData.payAmount)
          body.should.have.property('idOperation').eql(contractData.id)
          done()
        })
    })
    it('it should POST a reservations ', (done) => {
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
      chai
        .request(server)
        .post(`${url}/reservations`)
        .set('Authorization', `Bearer ${token}`)
        .send(reservationsPost)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(201)
          body.should.be.a('object')
          body.should.include.keys('_id', 'amount', 'status', 'code')
          body.should.have.property('amount').to.be.a('Number')
          body.should.have.property('amount').eql(980.1)
          body.should.have.property('status').eql('pending')
          body.should.have.property('travelerEmail').eql(fackEmail)
          idReservation = body._id
          amountReservation = body.amount
          createdReservation.push(body._id)
          done()
        })
    })
  })

  describe('/POST payment', () => {
    it('it should NOT POST payment reservation with wallet', (done) => {
      const orderPost = {
        idReservation,
        amount: 500
      }
      chai
        .request(server)
        .post(`${url}/payorders`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPost)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.a('object')
          body.should.have.property('errors')
          const { errors } = body
          errors.should.have.property('msg').eql('Amount Error')
          done()
        })
    })

    it('it should POST to save money in wallet 10000', (done) => {
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
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys('id', 'client_secret')
          const customData = res.body
          chai
            .request(server)
            .patch(`${url}/payorders/${res.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(customData)
            .end((error, result) => {
              const { body } = result
              result.should.have.status(200)
              body.should.be.a('object')
              body.should.include.keys('_id', 'idOperation')
              body.should.have.property('status').eql('succeeded')
              body.should.have.property('idOperation').eql(res.body.id)
              body.should.have.property('amount').to.be.a('Number')
              body.should.have.property('amount').eql(price)
              done()
            })
        })
    })

    it('it should GET Total in wallet', (done) => {
      chai
        .request(server)
        .get(`${url}/wallets`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          const { total } = body
          body.should.be.a('object')
          body.totalDocs.should.be.a('number')
          body.should.include.keys('total', 'docs')
          total.should.be.a('number').eql(10000)
          done()
        })
    })

    it('it should POST payment with wallet', (done) => {
      const orderPost = {
        idReservation,
        amount: amountReservation
      }
      chai
        .request(server)
        .post(`${url}/payorders`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPost)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(201)
          body.should.be.a('object')
          body.should.have.property('amount').eql(amountReservation)
          body.should.have.property('status').eql('succeeded')
          done()
        })
    })
  })

  after(() => {
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
