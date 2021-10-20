/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const faker = require('faker')


const departure = require('../../app/models/departure')
const server = require('../../superTest')
const request = require('supertest')
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
  describe('/POST departures', () => {
    test('it should NOT POST a departure without departure', (done) => {
      const departurePostOne = {}
      request(server)
        .post(`${url}/departures`)
        .set('Authorization', `Bearer ${token}`)
        .send(departurePostOne)
        .expect(422)
        .end((err, res) => {
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
        .expect(201)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            endDateDeparture: expect.any(String),
            createdAt: expect.any(String),
          }))
          expect(body).toHaveProperty('closeDateDeparture', '15-11-2020')
          expect(body.payAmount).toBeInstanceOf(Array)
          expect(body.payAmount).toHaveLength(0)
          expect(body).toHaveProperty('startDateDeparture', '21-03-2021')
          expect(body).toHaveProperty('status', 'visible')
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
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            closeDateDeparture: expect.any(String),
            idTour: expect.any(String),
            minStock: expect.any(Number),
            normalPrice: expect.any(Number),
          }))
          expect(body).toHaveProperty('_id', id)
          expect(body).toHaveProperty('startDateDeparture', '21-05-2021')
          // expect(body.minStock).toBeInstanceOf(Number)
          // expect(body.normalPrice).toBeInstanceOf(Number)
          // expect(typeof body.closeDateDeparture).toBe('string')
          // expect(typeof body.idTour).toBe('string')
          createdID.push(res.body._id)
          done()
        })
    })
    test('it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .patch(`${url}/departures/${id}`)
          .send({})
          .expect(401)
          .end((err, res) => {
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
        .expect(201)
        .end((err, res) => {
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.objectContaining({
            _id: expect.any(String)
          }))
          request(server)
            .delete(`${url}/departures/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((error, result) => {
              expect(result.body).toBeInstanceOf(Object)
              expect(result.body).toHaveProperty('msg', 'DELETED')
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
