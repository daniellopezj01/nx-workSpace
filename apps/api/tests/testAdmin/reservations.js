/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'
const _ = require('lodash')
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const reservation = require('../../app/models/reservation')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
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

// chai.use(chaiHttp)

describe('*********** RESERVATIONS_ADMIN ***********', () => {
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
  describe('/GET reservations', () => {
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      chai
        .request(server)
        .get(`${url}/reservations/all`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
    it('it should GET all the Reservations', (done) => {
      chai
        .request(server)
        .get(`${url}/reservations/all`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200)
          const { body } = res
          body.should.be.an('object')
          const { docs, totalDocs } = body
          docs.should.be.a('array')
          totalDocs.should.be.a('number')
          const reservationHead = _.head(docs)
          reservationHead.should.include.keys('code', 'departure', 'idTour')
          reservationHead.should.have.property('user').be.a('object')
          reservationHead._id.should.be.a('string')
          reservationHead.travelerLastName.should.be.a('string')
          reservationHead.should.have
            .property('travelerFirstName')
            .eql('daniel')
          done()
        })
    })
  })
  describe('/POST reservations', () => {
    it('it should NOT POST a reservation without tour', (done) => {
      const reservationsOne = {}
      chai
        .request(server)
        .post(`${url}/reservations`)
        .set('Authorization', `Bearer ${token}`)
        .send(reservationsOne)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.a('object')
          body.should.have.property('errors')
          const { errors } = body
          errors.should.have.property('msg').be.a('array')
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
        idTour,
        idDeparture,
        idUser,
        status: 'pending'
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
          body.should.have.property('amount').eql(948.99)
          body.should.have.property('status').eql('pending')
          body.should.have.property('travelerEmail').eql(fackEmail)
          body.should.have.property('idTour').eql(idTour)
          createdID.push(body._id)
          done()
        })
    })
    it('it should NOT POST a reservation', (done) => {
      const reservationsTwo = {
        travelerAddres: faker.random.word(),
        travelerGender: faker.random.word(),
        idDeparture
      }
      chai
        .request(server)
        .post(`${url}/reservations`)
        .set('Authorization', `Bearer ${token}`)
        .send(reservationsTwo)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.a('object')
          body.should.have.property('errors')
          const { errors } = body
          errors.should.be.a('object')
          errors.should.have.property('msg').be.a('array')
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const reservationsTwo = {
        travelerAddres: faker.random.word(),
        travelerGender: faker.random.word(),
        idDeparture
      }
      chai
        .request(server)
        .post(`${url}/reservations`)
        .send(reservationsTwo)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/GET/:id Reservation', () => {
    it('it should not  GET reservation by the given code', (done) => {
      chai
        .request(server)
        .get(`${url}/reservations/getDetails/000-000`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          res.should.have.status(404)
          body.should.be.a('object')
          body.should.have
            .property('errors')
            .eql({ msg: 'NOT_FOUND_RESERVATION' })
          done()
        })
    })
    it('it should GET a reservation by the given code', (done) => {
      chai
        .request(server)
        .get(`${url}/reservations/getDetails/${codeReservation}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.include.keys(
            'transactions',
            'travelerFirstName',
            'amount',
            'code',
            '_id'
          )
          body.should.have.property('_id').eql(idReservation)
          body.should.have.property('code').eql(codeReservation)
          body.amount.should.be.a('number')
          body.asTour.should.be.a('object')
          body.asDeparture.should.be.a('object')
          body.asUser.should.be.a('object')
          body.should.have.property('travelerEmail').eql(loginDetails.email)
          done()
        })
    })
    it('it should GET a tour by the given id', (done) => {
      chai
        .request(server)
        .get(`${url}/reservations/getDetails/${idReservation}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.include.keys(
            'transactions',
            'travelerFirstName',
            'amount',
            'code',
            '_id'
          )
          body.should.have.property('_id').eql(idReservation)
          body.should.have.property('code').eql(codeReservation)
          body.amount.should.be.a('number')
          body.transactions.should.be.a('array').length(0)
          body.should.have.property('travelerEmail').eql(loginDetails.email)
          done()
        })
    })
  })

  describe('/PATCH/:id reservations', () => {
    it('it should UPDATE a tour given the id', (done) => {
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
      chai
        .request(server)
        .patch(`${url}/reservations/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(dataUpdate)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('_id').eql(id)
          body.should.include.keys(
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
          )
          body.should.have.property('emergencyName').eql(emergencyName)
          body.should.have.property('emergencyLastName').eql(emergencyLastName)
          createdID.push(res.body._id)
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const id = createdID.slice(-1).pop()
      const name = faker.random.words()
      const lastName = faker.random.words()
      chai
        .request(server)
        .patch(`${url}/reservations/${id}`)
        .send({
          emergencyName: name,
          emergencyLastName: lastName,
          travelerBirthDay: '02-10-2020'
        })
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/DELETE/:id reservations', () => {
    it('it should DELETE a tour given the id', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .delete(`${url}/reservations/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, result) => {
          const { body } = result
          result.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('msg').eql('DELETED')
          done()
        })
    })
  })

  after(() => {
    createdID.forEach((id) => {
      reservation.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
