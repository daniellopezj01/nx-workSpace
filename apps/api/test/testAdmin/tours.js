/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const Tour = require('../../app/models/tour')
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
const title = 'bogota'
const subTitle = faker.random.words()
const description = faker.random.words()
const route = faker.random.words()
const newtour = faker.random.words()

const url = process.env.URL_TEST_ADMIN
chai.use(chaiHttp)

describe('*********** TOURS_ADMIN ***********', () => {
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

  describe('/GET tours', () => {
    it('it should GET all the tours', (done) => {
      chai
        .request(server)
        .get(`${url}/tours`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          const { docs, totalDocs } = body
          body.should.be.an('object')
          body.hasNextPage.should.be.a('boolean')
          body.hasPrevPage.should.be.a('boolean')
          body.limit.should.be.a('number')
          body.page.should.be.a('number')
          body.pagingCounter.should.be.a('number')
          body.totalPages.should.be.a('number')
          totalDocs.should.be.a('number').eql(2)
          docs.should.be.a('array')
          docs.should.have.lengthOf(2)
          done()
        })
    })
    it('it should GET the tours with limit', (done) => {
      chai
        .request(server)
        .get(`${url}/tours?limit=1`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200)
          const { body } = res
          body.should.be.an('object')
          body.docs.should.be.a('array')
          body.docs.should.have.lengthOf(1)
          done()
        })
    })
    it('it should GET the tours with slug', (done) => {
      chai
        .request(server)
        .get(`${url}/tours/tour-one`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.should.be.a('object')
          body.should.include.keys('_id', 'countries', 'departures', 'itinerary')
          body.should.have.property('slug').eql('tour-one')
          body.should.have.property('status').eql('publish')
          body.should.have.property('departures').be.a('array').length(1)
          body.should.have.property('itinerary').be.a('array').length(2)
          done()
        })
    })
    it('it should GET number tours all continents', (done) => {
      chai
        .request(server)
        .get(`${url}/tours/allContinents`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.docs.should.be.an('Array').length(5)
          done()
        })
    })
  })

  describe('/GET/:id tour', () => {
    it('it should GET a tour by the given id', (done) => {
      chai
        .request(server)
        .get(`${url}/tours/5fa181b202945b26c456176a`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('title')
          body.should.have.property('_id').eql('5fa181b202945b26c456176a')
          done()
        })
    })
    it('it should GET a tour by the given slug', (done) => {
      chai
        .request(server)
        .get(`${url}/tours/tour-one`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('title')
          body.should.have.property('slug').eql('tour-one')
          done()
        })
    })
  })

  describe('/POST tour', () => {
    it('it should NOT POST a tour without tour', (done) => {
      const tour = {}
      chai
        .request(server)
        .post(`${url}/tours`)
        .set('Authorization', `Bearer ${token}`)
        .send(tour)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          done()
        })
    })
    it('it should POST a tour ', (done) => {
      const tour = {
        title,
        subTitle,
        description,
        countries: faker.random.number(),
        cities: faker.random.number(),
        duration: faker.random.number(),
        route,
        video: 'https://hello.io'
      }
      chai
        .request(server)
        .post(`${url}/tours`)
        .set('Authorization', `Bearer ${token}`)
        .send(tour)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys('_id')
          res.body.should.have.property('title').eql(title)
          createdID.push(res.body._id)
          done()
        })
    })
    it('it should NOT POST a tour that already exists', (done) => {
      const tour = {
        title
      }
      chai
        .request(server)
        .post(`${url}/tours`)
        .set('Authorization', `Bearer ${token}`)
        .send(tour)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          done()
        })
    })
  })

  describe('/PATCH/:id tour', () => {
    it('it should UPDATE a tour given the id', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .patch(`${url}/tours/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: newtour,
          subTitle: faker.random.words(),
          description: faker.random.words(),
          route: faker.random.words(),
          video: 'https://hello.io'
        })
        .end((error, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('_id').eql(id)
          body.should.have.property('title').eql(newtour)
          createdID.push(res.body._id)
          done()
        })
    })
    it('it NOT should UPDATE a tour unauthorized', (done) => {
      const id = createdID.slice(-1).pop()
      chai
        .request(server)
        .patch(`${url}/tours/${id}`)
        .send({
          title: newtour
        })
        .end((error, res) => {
          res.should.have.status(401)
          res.body.should.be.a('object')
          done()
        })
    })
  })

  describe('/DELETE/:id tour', () => {
    it('it should DELETE a tour given the id', (done) => {
      const tour = {
        title: faker.random.words(),
        subTitle,
        description,
        countries: faker.random.number(),
        cities: faker.random.number(),
        duration: faker.random.number(),
        route,
        video: 'https://hello.io'
      }
      chai
        .request(server)
        .post(`${url}/tours`)
        .set('Authorization', `Bearer ${token}`)
        .send(tour)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.include.keys(
            '_id',
            'title',
            'subTitle',
            'description',
            'route'
          )
          chai
            .request(server)
            .delete(`${url}/tours/${res.body._id}`)
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
    createdID.forEach((id) => {
      Tour.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
