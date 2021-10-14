/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
chai.use(chaiHttp)
const url = process.env.URL_TEST_USER

describe('*********** SETTINGS_USERS ***********', () => {
  describe('/GET settings/check', () => {
    it('it should GET ', (done) => {
      chai
        .request(server)
        .get(`${url}/settings/check`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.should.include.keys('currencies', 'payAmount', 'name')
          body.currencies.should.be.a('array')
          body.payAmount.should.be.a('array')
          body.name.should.be.a('string')
          done()
        })
    })
  })
})
