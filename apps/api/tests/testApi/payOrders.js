/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const faker = require('faker')


const orders = require('../../app/models/payOrder')
const reservations = require('../../app/models/reservation')
const server = require('../../server')
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


describe('*********** PAY_ORDERS_USERS ***********', () => {
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
  describe('/POST reservations', () => {
    test('it should POST a contracts 100 percentage', (done) => {
      request(server)
        .post(`${url}/contracts`)
        .set('Authorization', `Bearer ${token}`)
        .send(contractData)
        .end((err, res) => {
          expect(res).have.status(200)
          const { body } = res
          idIntention = body._id
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('percentage').toEqual(contractData.payAmount)
          expect(body).have.property('idOperation').toEqual(contractData.id)
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
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(201)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'amount', 'status', 'code']))
          expect(body).toBeInstanceOf(Number)
          expect(body).have.property('amount').toBe(980.1)
          expect(body).have.property('status').toBe('pending')
          expect(body).have.property('travelerEmail').toEqual(fackEmail)
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
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(errors).have.property('msg').toBe('Amount Error')
          done()
        })
    })

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
        .end((err, res) => {
          expect(res).have.status(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['id', 'client_secret']))
          const customData = res.body
          request(server)
            .patch(`${url}/payorders/${res.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(customData)
            .end((error, result) => {
              const { body } = result
              expect(result).have.status(200)
              expect(body).toBeInstanceOf(Object)
              expect(body).toEqual(expect.arrayContaining(['_id', 'idOperation']))
              expect(body).have.property('status').toBe('succeeded')
              expect(body).have.property('idOperation').toEqual(res.body.id)
              expect(body).toBeInstanceOf(Number)
              expect(body).have.property('amount').toEqual(price)
              done()
            })
        })
    })

    test('it should GET Total in wallet', (done) => {
      request(server)
        .get(`${url}/wallets`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          const { total } = body
          expect(body).toBeInstanceOf(Object)
          expect(body.totalDocs).toBeInstanceOf(Number)
          expect(body).toEqual(expect.arrayContaining(['total', 'docs']))
          expect(total).be.a('number').toBe(10000)
          done()
        })
    })

    test('it should POST payment with wallet', (done) => {
      const orderPost = {
        idReservation,
        amount: amountReservation
      }
      request(server)
        .post(`${url}/payorders`)
        .set('Authorization', `Bearer ${token}`)
        .send(orderPost)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(201)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('amount').toEqual(amountReservation)
          expect(body).have.property('status').toBe('succeeded')
          done()
        })
    })
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
