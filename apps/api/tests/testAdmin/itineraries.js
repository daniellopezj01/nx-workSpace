/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'
const _ = require('lodash')
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const itinerary = require('../../app/models/itinerary')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}

let token = ''
let accessToken = ''
let idItinerary = ''
const createdID = []
const itineraryName = 'LUGAR 1'
const url = process.env.URL_TEST_ADMIN
const idTour = '5fa181b202945b26c456176a'
const changeNameItinerary = faker.random.words()
const newObject = {
  itineraryName,
  itineraryDescription: faker.random.words(),
  idTour,
  stringLocation: {
    city: faker.random.words(),
    country: faker.random.words(),
    countryCode: 'BE',
    coordinates: [faker.address.latitude(), faker.address.longitude()]
  },
  details: [
    {
      title: faker.random.words(),
      description: faker.random.words()
    },
    {
      title: faker.random.words()
    }
  ]
}
// chai.use(chaiHttp)

describe('*********** ITINERARIES_ADMIN ***********', () => {
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

  describe('/GET itineraries', () => {
    it('it should GET all the itineraries', (done) => {
      chai
        .request(server)
        .get(`${url}/itineraries`)
        .end((err, res) => {
          res.should.have.status(200)
          const { body } = res
          body.should.be.an('object')
          body.docs.should.be.a('array')
          const firstItinerary = _.head(body.docs)
          idItinerary = firstItinerary._id
          firstItinerary.should.include.keys(
            '_id',
            'itineraryName',
            'itineraryDescription',
            'idTour',
            'stringLocation',
            'details'
          )
          firstItinerary._id.should.be.a('string')
          firstItinerary.itineraryName.should.be.a('string')
          firstItinerary.idTour.should.be.a('string').eql(idTour)
          firstItinerary.details.should.be.a('array')
          done()
        })
    })
  })

  describe('/POST itineraries', () => {
    it('it should NOT POST a itinerary without itinerary', (done) => {
      const itineraryOne = {}
      chai
        .request(server)
        .post(`${url}/itineraries`)
        .set('Authorization', `Bearer ${token}`)
        .send(itineraryOne)
        .end((err, res) => {
          res.should.have.status(422)
          const { body } = res
          body.should.be.a('object')
          body.should.have.property('errors')
          const { errors } = body
          errors.should.have.property('msg').be.a('array')
          done()
        })
    })
    it('it should POST a itineraries ', (done) => {
      chai
        .request(server)
        .post(`${url}/itineraries`)
        .set('Authorization', `Bearer ${token}`)
        .send(newObject)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(201)
          body.should.be.a('object')
          body.should.include.keys('_id', 'stringLocation')
          body.should.include.property('itineraryName').eql(itineraryName)
          body._id.should.be.a('string')
          body.itineraryName.should.be.a('string')
          body.itineraryDescription.should.be.a('string')
          body.idTour.should.be.a('string').eql(idTour)
          body.stringLocation.should.be.a('object')
          body.details.should.be.a('array')
          createdID.push(res.body._id)
          done()
        })
    })
    it('it should NOT POST a itinerary that incomplete fields', (done) => {
      const itineraryTwo = {
        changeNameItinerary
      }
      chai
        .request(server)
        .post(`${url}/itineraries`)
        .set('Authorization', `Bearer ${token}`)
        .send(itineraryTwo)
        .end((err, res) => {
          res.should.have.status(422)
          const { body } = res
          body.should.be.a('object')
          body.should.have.property('errors')
          const { errors } = body
          errors.should.have.property('msg').be.a('array')
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      chai
        .request(server)
        .post(`${url}/itineraries`)
        .send(newObject)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })

  describe('/GET/:id itineraries', () => {
    it('it should GET a itinerary by the given id', (done) => {
      chai
        .request(server)
        .get(`${url}/itineraries/${idItinerary}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('_id').eql(idItinerary)
          // res.body.should.include.property('itineraryName').eql(itineraryName)
          body._id.should.be.a('string')
          body.itineraryName.should.be.a('string')
          body.itineraryDescription.should.be.a('string')
          body.idTour.should.be.a('string').eql(idTour)
          body.stringLocation.should.be.a('object')
          body.details.should.be.a('array')
          done()
        })
    })
    it('it should GET a itinerary by the given id rute admin', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/itineraries/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          res.should.have.status(200)
          const { body } = res
          body.should.be.a('object')
          body.should.have.property('_id').eql(id)
          body.should.include.property('itineraryName').eql(itineraryName)
          body._id.should.be.a('string')
          body.itineraryName.should.be.a('string')
          body.itineraryDescription.should.be.a('string')
          body.idTour.should.be.a('string')
          body.stringLocation.should.be.a('object')
          body.details.should.be.a('array').length(2)
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent rute admin', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .get(`${url}/itineraries/${id}`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
  describe('/PATCH/:id itineraries', () => {
    it('it should UPDATE a itinerary given the id', (done) => {
      const id = createdID.slice(-1).pop()
      const newDescription = faker.random.words()
      const newTitle = faker.random.words()
      chai
        .request(server)
        .patch(`${url}/itineraries/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          itineraryName: newTitle,
          itineraryDescription: newDescription
        })
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.include.keys(
            '_id',
            'itineraryDescription',
            'itineraryName'
          )
          body.itineraryName.should.be.a('string')
          body.should.have.property('_id').eql(id)
          body.should.have.property('itineraryName').eql(newTitle)
          body.should.have.property('itineraryDescription').eql(newDescription)
          done()
        })
    })
  })
  it('it should NOT be able to consume the route since no token was sent', (done) => {
    const id = createdID.slice(-1).pop()
    const newDescription = faker.random.words()
    const newTitle = faker.random.words()
    chai
      .request(server)
      .patch(`${url}/itineraries/${id}`)
      .send({
        itineraryName: newTitle,
        itineraryDescription: newDescription
      })
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
  })
})

describe('/DELETE/:id itineraries', () => {
  it('it should DELETE a itinerary given the id', (done) => {
    const id = createdID.slice(-1).pop()
    chai
      .request(server)
      .delete(`${url}/itineraries/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .end((error, result) => {
        result.should.have.status(200)
        result.body.should.be.a('object')
        result.body.should.have.property('msg').eql('DELETED')
        done()
      })
  })
})

after(() => {
  createdID.forEach((id) => {
    itinerary.findByIdAndRemove(id, (err) => {
      if (err) {
        // console.log(err)
      }
    })
  })
})
