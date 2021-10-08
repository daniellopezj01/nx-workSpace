/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = 'test'
const _ = require('lodash')
const chai = require('chai')
const chaiHttp = require('chai-http')
const modalCategory = require('../../app/models/category')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const loginDetails = {
  email: 'user@user.com',
  password: '12345'
}
const createdID = []

const url = process.env.URL_TEST_USER
chai.use(chaiHttp)

describe('*********** CATEGORIES_USER ***********', () => {
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
          done()
        })
    })
  })

  describe('/GET categories', () => {
    it('it should GET all the categories', (done) => {
      chai
        .request(server)
        .get(`${url}/categories`)
        .end((err, res) => {
          const { body } = res
          const { docs } = body
          const category = _.head(docs)
          res.should.have.status(200)
          body.should.be.an('object')
          docs.should.have.lengthOf(1)
          id = category._id
          category.should.include.keys('_id', 'name', 'description')
          done()
        })
    })
    it('it should NOT GET the categories with filters', (done) => {
      chai
        .request(server)
        .get(`${url}/categories?filter=notExist&fields=name`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          const { body } = res
          const { docs, totalDocs } = body
          totalDocs.should.be.a('number')
          body.should.have.property('totalDocs').eql(0)
          docs.should.have.lengthOf(0)
          done()
        })
    })
    it('it should GET the categories with filters', (done) => {
      chai
        .request(server)
        .get(`${url}/categories?filter=technology&fields=name`)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          const { body } = res
          const { docs } = body
          const category = _.head(docs)
          body.should.be.an('object')
          docs.should.have.lengthOf(1)
          category.should.include.keys('_id', 'name', 'description')
          category.should.have.property('name').eql('technology')
          done()
        })
    })
  })
  after(() => {
    createdID.forEach((idCategory) => {
      modalCategory.findByIdAndRemove(idCategory, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
