/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const departure = require('../../app/models/departure')
const server = require('../../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const createdID = []
const idTour = '5fa181b202945b26c456176a'
const url = process.env.URL_TEST_ADMIN


describe('*********** DEPARTURES_ADMIN ***********', () => {
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

  describe('/POST departures', () => {
    test('it should NOT POST a departure without departure', (done) => {
      const departurePostOne = {}
      request(server)
        .post(`${url}/departures`)
        .set('Authorization', `Bearer ${token}`)
        .send(departurePostOne)
        .end((err, res) => {
          expect(res).have.status(422)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty('errors')
          done()
        })
    })
    test('it should POST a departure ', (done) => {
      const departurePostTwo = {
        startDateDeparture: '21-03-2021',
        endDateDeparture: '11-04-2021',
        minAge: faker.random.number(),
        maxAge: faker.random.number(),
        stock: faker.random.number(),
        minStock: faker.random.number(),
        normalPrice: faker.random.number(),
        closeDateDeparture: '15-11-2020',
        flight: faker.random.boolean(),
        idTour,
        status: 'visible'
      }
      request(server)
        .post(`${url}/departures`)
        .set('Authorization', `Bearer ${token}`)
        .send(departurePostTwo)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(201)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'createdAt']))
          expect(body).have.property('closeDateDeparture').toBe('15-11-2020')
          expect(typeof body._id).toBe('string')
          expect(body.payAmount).be.a('array').toHaveLength(0)
          expect(body).have.property('startDateDeparture').toBe('21-03-2021')
          expect(body).have.property('status').toBe('visible')
          expect(typeof body.endDateDeparture).toBe('string')
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/PATCH/:id departures', () => {
    test('it should UPDATE a departure given the id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .patch(`${url}/departures/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          startDateDeparture: '21-05-2021',
          endDateDeparture: '11-05-2021',
          stock: faker.random.number(),
          minStock: faker.random.number(),
          minAge: faker.random.number(),
          maxAge: faker.random.number(),
          normalPrice: faker.random.number(),
          closeDateDeparture: '15-11-2020',
          flight: faker.random.boolean(),
          idTour
        })
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('_id').toEqual(id)
          expect(body).have.property('startDateDeparture').toBe('21-05-2021')
          expect(typeof body._id).toBe('string')
          expect(body.minStock).toBeInstanceOf(Number)
          expect(body.normalPrice).toBeInstanceOf(Number)
          expect(typeof body.closeDateDeparture).toBe('string')
          expect(typeof body.idTour).toBe('string')
          createdID.push(res.body._id)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .patch(`${url}/departures/${id}`)
          .send({
            startDateDeparture: '21-05-2021',
            endDateDeparture: '11-05-2021',
            stock: faker.random.number(),
            minStock: faker.random.number(),
            normalPrice: faker.random.number(),
            closeDateDeparture: '15-11-2020',
            flight: faker.random.boolean(),
            payAmount: faker.finance.amount(),
            idTour
          })
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })

  describe('/DELETE/:id departure', () => {
    test('it should DELETE a departure given the id', (done) => {
      const departuredelete = {
        startDateDeparture: '21-05-2021',
        endDateDeparture: '11-05-2021',
        stock: faker.random.number(),
        minStock: faker.random.number(),
        normalPrice: faker.random.number(),
        closeDateDeparture: '15-11-2020',
        payAmount: faker.finance.amount(),
        flight: faker.random.boolean(),
        idTour,
        status: 'visible'
      }
      request(server)
        .post(`${url}/departures`)
        .set('Authorization', `Bearer ${token}`)
        .send(departuredelete)
        .end((err, res) => {
          expect(res).have.status(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining('_id'))
          chai
            .request(server)
            .delete(`${url}/departures/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((error, result) => {
              expect(result).have.status(200)
              expect(result.body).toBeInstanceOf(Object)
              expect(result.body).have.property('msg').toBe('DELETED')
              done()
            })
        })
    })
  })

  afterAll(() => {
    createdID.forEach((idDeparture) => {
      departure.findByIdAndRemove(idDeparture, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
