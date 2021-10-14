/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

// const _ = require('lodash')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
chai.use(chaiHttp)

const url = process.env.URL_TEST_USER

describe('*********** EXTERNAL_USERS ***********', () => {
  describe('/GET blog', () => {
    it('it should GET all the blogg', (done) => {
      chai
        .request(server)
        .get(`${url}/external/blog`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(404)
          body.should.be.an('object')
          body.should.have.property('errors').eql({})
          done()
        })
    })
  })
  // describe('/GET instagram', () => {
  //   it('it should GET all the instagrams', (done) => {
  //     chai
  //       .request(server)
  //       .get(`${url}/external/instagram`)
  //       .end((err, res) => {
  //         const { body } = res
  //         res.should.have.status(200)
  //         body.should.be.an('object')
  //         body.should.have.property('data')
  //         const { data } = body
  //         data.should.be.an('Array')
  //         const first = _.head(data)
  //         first.should.include.keys('id', 'caption')
  //         first.should.have.property('username').eql('mochileros.mex')
  //         done()
  //       })
  //   })
  // })
})
