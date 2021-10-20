/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'
const _ = require('lodash')
const faker = require('faker')

const reservation = require('../../app/models/reservation')
const server = require('../../superTest')
const request = require('supertest')
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
  describe('/GET reservations', () => {
    test('it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .get(`${url}/reservations/all`)
          .expect(401)
          .end((err, res) => {
            done()
          })
      }
    )
    test('it should GET all the Reservations', (done) => {
      request(server)
        .get(`${url}/reservations/all`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          const { docs } = body
          expect(body).toEqual(expect.objectContaining({
            docs: expect.any(Array),
            totalDocs: expect.any(Number),
          }))
          const reservationHead = _.head(docs)
          expect(reservationHead).toEqual(expect.objectContaining({
            _id: expect.any(String),
            code: expect.any(String),
            travelerLastName: expect.any(String),
            idTour: expect.any(String),
            departure: expect.any(Object),
          }))
          expect(reservationHead).toHaveProperty('travelerFirstName', 'daniel')
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
        .expect(201)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            amount: expect.any(Number),
            status: expect.any(String),
            code: expect.any(String),
          }))
          expect(body).toHaveProperty('amount', 948.99)
          expect(body).toHaveProperty('status', 'pending')
          expect(body).toHaveProperty('travelerEmail', fackEmail)
          expect(body).toHaveProperty('idTour', idTour)
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
    test(
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
          .expect(401)
          .end((err, res) => {
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
        .expect(404)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors', { msg: 'NOT_FOUND_RESERVATION' })
          done()
        })
    })
    test('it should GET a reservation by the given code', (done) => {
      request(server)
        .get(`${url}/reservations/getDetails/${codeReservation}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            amount: expect.any(Number),
            status: expect.any(String),
            code: expect.any(String),
            transactions: expect.any(Array),
            asTour: expect.any(Object),
            asDeparture: expect.any(Object),
            asUser: expect.any(Object),
          }))
          expect(body).toHaveProperty('_id', idReservation)
          expect(body).toHaveProperty('code', codeReservation)
          expect(body).toHaveProperty('travelerEmail', loginDetails.email)
          done()
        })
    })
    test('it should GET a tour by the given id', (done) => {
      request(server)
        .get(`${url}/reservations/getDetails/${idReservation}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            amount: expect.any(Number),
            status: expect.any(String),
            code: expect.any(String),
            transactions: expect.any(Array),
            asTour: expect.any(Object),
            asDeparture: expect.any(Object),
            asUser: expect.any(Object),
          }))
          expect(body).toHaveProperty('_id', idReservation)
          expect(body).toHaveProperty('code', codeReservation)
          expect(body.transactions).toHaveLength(0)
          expect(body).toHaveProperty('travelerEmail', loginDetails.email)
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
        .expect(200)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            amount: expect.any(Number),
            status: expect.any(String),
            code: expect.any(String),
          }))
          expect(body).toHaveProperty('_id', id)
          expect(body).toHaveProperty('emergencyName', emergencyName)
          expect(body).toHaveProperty('emergencyLastName', emergencyLastName)
          createdID.push(res.body._id)
          done()
        })
    })
    test(
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
          .expect(401)
          .end((err, res) => {
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
        .expect(200)
        .end((error, result) => {
          const { body } = result
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('msg', 'DELETED')
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
