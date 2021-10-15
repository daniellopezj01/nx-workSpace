/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'
const _ = require('lodash')
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const reservation = require('../../app/models/reservation')
const server = require('../../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const codeReservation = '665-446'
const idReservation = '5fa18bde4087883d305e6800'
const idTour = '5fa181b202945b26c456176a'
const idUser = '5aa1c2c35ef7a4e97b5e995a'
const idDeparture = '5f7dd6b56ce74a8e3ff15add'

/** RESERVATION */
const url = process.env.URL_TEST_ADMIN
const createdID = []



describe('*********** RESERVATIONS_ADMIN ***********', () => {
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
  describe('/GET reservations', () => {
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .get(`${url}/reservations/all`)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
    test('it should GET all the Reservations', (done) => {
      request(server)
        .get(`${url}/reservations/all`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).have.status(200)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          const { docs, totalDocs } = body
          expect(Array.isArray(docs)).toBe(true)
          expect(totalDocs).toBeInstanceOf(Number)
          const reservationHead = _.head(docs)
          expect(reservationHead).toEqual(expect.arrayContaining(['code', 'departure', 'idTour']))
          expect(reservationHead).toBeInstanceOf(Object)
          expect(typeof reservationHead._id).toBe('string')
          expect(typeof reservationHead.travelerLastName).toBe('string')
          expect(reservationHead).have
            .property('travelerFirstName').toBe('daniel')
          done()
        })
    })
  })
  describe('/POST reservations', () => {
    test('it should NOT POST a reservation without tour', (done) => {
      const reservationsOne = {}
      request(server)
        .post(`${url}/reservations`)
        .set('Authorization', `Bearer ${token}`)
        .send(reservationsOne)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(Array.isArray(errors)).toBe(true)
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
        idTour,
        idDeparture,
        idUser,
        status: 'pending'
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
          expect(body).have.property('amount').toBe(948.99)
          expect(body).have.property('status').toBe('pending')
          expect(body).have.property('travelerEmail').toEqual(fackEmail)
          expect(body).have.property('idTour').toEqual(idTour)
          createdID.push(body._id)
          done()
        })
    })
    test('it should NOT POST a reservation', (done) => {
      const reservationsTwo = {
        travelerAddres: faker.random.word(),
        travelerGender: faker.random.word(),
        idDeparture
      }
      request(server)
        .post(`${url}/reservations`)
        .set('Authorization', `Bearer ${token}`)
        .send(reservationsTwo)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(errors).toBeInstanceOf(Object)
          expect(Array.isArray(errors)).toBe(true)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const reservationsTwo = {
          travelerAddres: faker.random.word(),
          travelerGender: faker.random.word(),
          idDeparture
        }
        request(server)
          .post(`${url}/reservations`)
          .send(reservationsTwo)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })

  describe('/GET/:id Reservation', () => {
    test('it should not  GET reservation by the given code', (done) => {
      request(server)
        .get(`${url}/reservations/getDetails/000-000`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(404)
          expect(body).toBeInstanceOf(Object)
          expect(body).have
            .property('errors').toEqual({ msg: 'NOT_FOUND_RESERVATION' })
          done()
        })
    })
    test('it should GET a reservation by the given code', (done) => {
      request(server)
        .get(`${url}/reservations/getDetails/${codeReservation}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(
            expect.arrayContaining(['transactions', 'travelerFirstName', 'amount', 'code', '_id'])
          )
          expect(body).have.property('_id').toEqual(idReservation)
          expect(body).have.property('code').toEqual(codeReservation)
          expect(body.amount).toBeInstanceOf(Number)
          expect(body.asTour).toBeInstanceOf(Object)
          expect(body.asDeparture).toBeInstanceOf(Object)
          expect(body.asUser).toBeInstanceOf(Object)
          expect(body).have.property('travelerEmail').toEqual(loginDetails.email)
          done()
        })
    })
    test('it should GET a tour by the given id', (done) => {
      request(server)
        .get(`${url}/reservations/getDetails/${idReservation}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(
            expect.arrayContaining(['transactions', 'travelerFirstName', 'amount', 'code', '_id'])
          )
          expect(body).have.property('_id').toEqual(idReservation)
          expect(body).have.property('code').toEqual(codeReservation)
          expect(body.amount).toBeInstanceOf(Number)
          expect(body.transactions).be.a('array').toHaveLength(0)
          expect(body).have.property('travelerEmail').toEqual(loginDetails.email)
          done()
        })
    })
  })

  describe('/PATCH/:id reservations', () => {
    test('it should UPDATE a tour given the id', (done) => {
      const id = createdID.slice(-1).pop()
      const emergencyName = faker.random.words()
      const emergencyLastName = faker.random.words()
      const dataUpdate = {
        travelerFirstName: faker.random.words(),
        travelerLastName: faker.random.words(),
        travelerEmail: 'user@user.com',
        travelerPhone: {
          number: faker.random.words(),
          code: faker.random.words()
        },
        travelerDocument: faker.random.words(),
        travelerAddress: faker.random.words(),
        travelerBirthDay: '2020-09-11T13:58:49.529Z',
        travelerGender: 'F',
        country: faker.random.words(),
        city: faker.random.words(),
        observations: faker.random.words(),
        status: 'completed',
        buyerFirstName: faker.random.words(),
        buyerLastName: faker.random.words(),
        buyerDocument: faker.random.words(),
        buyerEmail: 'userdoc@user.com',
        buyerPhone: {
          number: faker.random.words(),
          code: faker.random.words()
        },
        buyerBirthDay: '2020-09-11T13:58:49.529Z',
        emergencyName,
        emergencyLastName,
        emergencyPhone: {
          number: faker.random.words(),
          code: faker.random.words()
        },
        invoice: faker.random.words(),
        idDeparture,
        customData: {}
      }
      request(server)
        .patch(`${url}/reservations/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(dataUpdate)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('_id').toEqual(id)
          expect(body).toEqual(expect.arrayContaining([
            'status',
            'deleted',
            '_id',
            'idDeparture',
            'country',
            'city',
            'amount',
            'idTour',
            'idUser',
            'code',
            'createdAt',
            'updatedAt',
            'buyerPhone',
            'emergencyLastName',
            'emergencyName',
            'emergencyPhone',
            'invoice',
            'observations'
          ]))
          expect(body).have.property('emergencyName').toEqual(emergencyName)
          expect(body).have.property('emergencyLastName').toEqual(emergencyLastName)
          createdID.push(res.body._id)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        const name = faker.random.words()
        const lastName = faker.random.words()
        request(server)
          .patch(`${url}/reservations/${id}`)
          .send({
            emergencyName: name,
            emergencyLastName: lastName,
            travelerBirthDay: '02-10-2020'
          })
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })

  describe('/DELETE/:id reservations', () => {
    test('it should DELETE a tour given the id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .delete(`${url}/reservations/${id}`)
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

  afterAll(() => {
    createdID.forEach((id) => {
      reservation.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
