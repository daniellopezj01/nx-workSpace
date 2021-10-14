/* eslint-disable no-undef */
/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const chai = require('chai')
const _ = require('lodash')
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
const createdID = []

const url = process.env.URL_TEST_USER

// chai.use(chaiHttp)

describe('*********** TOURS_USERS ***********', () => {
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
          _.map(docs, (a, i) => {
            docs[i].category.should.be.a('array').lengthOf(1)
            docs[i].should.include.keys('title', 'slug', 'route')
          })
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
    it('it should GET the tours with query,Empty', (done) => {
      chai
        .request(server)
        .get(`${url}/tours?query=zzzzzzzzzz`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200)
          const { body } = res
          body.should.be.an('object')
          body.docs.should.be.a('array')
          body.docs.should.have.lengthOf(0)
          done()
        })
    })
    it('it should GET the tours with query', (done) => {
      chai
        .request(server)
        .get(`${url}/tours?query=medellin`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.docs.should.be.a('array')
          body.docs.should.have.lengthOf(1)
          done()
        })
    })
    it('it should GET number tours for continents', (done) => {
      chai
        .request(server)
        .get(`${url}/tours/forContinents`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('Array')
          _.map(res.body, (a, i) => {
            body[i].should.have.property('count').to.be.a('number')
            body[i].should.have.property('count').to.be.above(0)
          })
          done()
        })
    })
    it('it should GET departures tours', (done) => {
      chai
        .request(server)
        .get(`${url}/tours/departures/tour-one`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('Object')
          body.should.have.property('departures')
          body.should.have.property('departures').be.an('Array')
          body.should.have.property('status').eql('publish')
          body.should.have.property('slug').eql('tour-one')
          body.departures.should.have.length(1)
          done()
        })
    })
  })

  describe('*********** SEARCH TOURS ******************', () => {
    it('with out params', (done) => {
      chai
        .request(server)
        .get(`${url}/tours/search`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(404)
          body.should.be.a('object')
          body.should.have.property('errors').eql({ msg: 'Params Error' })
          done()
        })
    })
    it('search with params', (done) => {
      chai
        .request(server)
        .get(`${url}/tours/search?query=MedeLLIN`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('tours')
          body.should.have.property('places')
          body.tours.should.have.lengthOf(1)
          body.tours[0].should.have.property('title').eql('tour one')
          done()
        })
    })
    it('empty search', (done) => {
      chai
        .request(server)
        .get(`${url}/tours/search?query=zzzzzzzzzzzzzzzzzz`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.a('object')
          body.should.have.property('tours')
          body.should.have.property('places')
          body.tours.should.have.lengthOf(0)
          body.places.should.have.lengthOf(0)
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
