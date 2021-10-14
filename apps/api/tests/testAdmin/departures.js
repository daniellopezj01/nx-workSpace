/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const departure = require('../../app/models/departure')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const createdID = []
const idTour = '5fa181b202945b26c456176a'
const url = process.env.URL_TEST_ADMIN
chai.use(chaiHttp)

describe('*********** DEPARTURES_ADMIN ***********', () => {
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

  describe('/POST departures', () => {
    it('it should NOT POST a departure without departure', (done) => {
      const departurePostOne = {}
      chai
        .request(server)
        .post(`${url}/departures`)
        .set('Authorization', `Bearer ${token}`)
        .send(departurePostOne)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          done()
        })
    })
    it('it should POST a departure ', (done) => {
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
      chai
        .request(server)
        .post(`${url}/departures`)
        .set('Authorization', `Bearer ${token}`)
        .send(departurePostTwo)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(201)
          body.should.be.a('object')
          body.should.include.keys('_id', 'createdAt')
          body.should.have.property('closeDateDeparture').eql('15-11-2020')
          body._id.should.be.a('string')
          body.payAmount.should.be.a('array').length(0)
          body.should.have.property('startDateDeparture').eql('21-03-2021')
          body.should.have.property('status').eql('visible')
          body.endDateDeparture.should.be.a('string')
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/PATCH/:id departures', () => {
    it('it should UPDATE a departure given the id', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
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
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('_id').eql(id)
          body.should.have.property('startDateDeparture').eql('21-05-2021')
          body._id.should.be.a('string')
          body.minStock.should.be.a('number')
          body.normalPrice.should.be.a('number')
          body.closeDateDeparture.should.be.a('string')
          body.idTour.should.be.a('string')
          createdID.push(res.body._id)
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
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
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/DELETE/:id departure', () => {
    it('it should DELETE a departure given the id', (done) => {
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
      chai
        .request(server)
        .post(`${url}/departures`)
        .set('Authorization', `Bearer ${token}`)
        .send(departuredelete)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys('_id')
          chai
            .request(server)
            .delete(`${url}/departures/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((error, result) => {
              result.should.have.status(200)
              result.body.should.be.a('object')
              result.body.should.have.property('msg').eql('DELETED')
              done()
            })
        })
    })
  })

  after(() => {
    createdID.forEach((idDeparture) => {
      departure.findByIdAndRemove(idDeparture, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
