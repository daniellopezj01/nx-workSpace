/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

// const _ = require('lodash')


const server = require('../../server')


const url = process.env.URL_TEST_USER

describe('*********** EXTERNAL_USERS ***********', () => {
  describe('/GET blog', () => {
    test('it should GET all the blogg', (done) => {
      request(server)
        .get(`${url}/external/blog`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(404)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('errors').toEqual({})
          done()
        })
    })
  })
  // describe('/GET instagram', () => {
  //   test('it should GET all the instagrams', (done) => {
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
