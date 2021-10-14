/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'
const _ = require('lodash')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()

chai.use(chaiHttp)

describe('*********** HOTELS_USERS ***********', () => {
  describe('/POST hotels For type', () => {
    it('it should not get Hotels For type, error in params because empty', (done) => {
      const paramsForType = {}
      chai
        .request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_hotels_selections'
        )
        .send(paramsForType)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.an('object')
          res.body.should.include.keys('errors')
          done()
        })
    })
    it('it should not get Hotels For type, error in params, property is missing', (done) => {
      const paramsForType = {
        params: {
          check_out: '2021-08-03',
          language: 'es',
          type: 'populary',
          limit: '5',
          id: '6230' // id city
        }
      }
      chai
        .request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_hotels_selections'
        )
        .send(paramsForType)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.an('object')
          res.body.should.include.keys('errors')
          res.body.should.have.property('errors').eql({
            msg: 'Param check_in is required'
          })

          done()
        })
    })
    it('it should get Hotels For type', (done) => {
      const paramsForType = {
        params: {
          check_in: '2021-08-01',
          check_out: '2021-08-03',
          language: 'es',
          type: 'populary',
          limit: '5',
          id: '6230' // id city
        }
      }
      chai
        .request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_hotels_selections'
        )
        .send(paramsForType)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.include.keys('populary')
          res.body.populary.should.be.an('Array')
          res.body.populary.should.have.lengthOf(5)
          done()
        })
    })
  })

  describe('/POST hotels For PRICE', () => {
    const locationId = 3683
    it('it should not get Hotels For PRICE, error in params because empty', (done) => {
      const paramsForHotel = {}
      chai
        .request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_cost_in_hotels'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.an('object')
          res.body.should.include.keys('errors')
          done()
        })
    })
    it('it should not get Hotels For PRICE, error in params, property is missing', (done) => {
      const paramsForHotel = {
        params: {
          locationId,
          checkOut: '2020-10-15',
          limit: '1000'
        }
      }
      chai
        .request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_cost_in_hotels'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.an('object')
          res.body.should.include.keys('errors')
          res.body.should.have.property('errors').eql({
            msg: 'Param checkIn is required'
          })
          done()
        })
    })
    it('it should not get Hotels For PRICE, error in Dates', (done) => {
      const paramsForHotel = {
        params: {
          locationId,
          checkIn: '2020-10-01',
          checkOut: '2020-10-15',
          limit: '10'
        }
      }
      chai
        .request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_cost_in_hotels'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('Array')
          res.body.should.have.lengthOf(0)
          done()
        })
    })
    it('it should get Hotels For PRICE', (done) => {
      const paramsForHotel = {
        params: {
          locationId,
          checkIn: '2021-10-01',
          checkOut: '2021-10-15',
          limit: '10'
        }
      }
      chai
        .request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_cost_in_hotels'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('Array')
          res.body.should.have.lengthOf(10)
          _.map(res.body, (a, b) => {
            res.body[b].should.include.keys('location', 'pricePercentile')
          })
          done()
        })
    })
  })
  describe('/POST hotels ALL HOTELS', () => {
    it('it should not get all Hotels, error in params because empty', (done) => {
      const paramsForHotel = {}
      chai
        .request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_search_management'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.an('object')
          res.body.should.include.keys('errors')
          done()
        })
    })
    it('it should not get all Hotels, error in params, property is missing', (done) => {
      const paramsForHotel = {
        params: {
          sortBy: 'popularity',
          checkIn: '2020-11-07',
          checkOut: '2020-11-16',
          adultsCount: 2,
          childrenCount: 0
        }
      }
      chai
        .request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_search_management'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.an('object')
          res.body.should.include.keys('errors')
          res.body.should.have.property('errors').eql({
            msg: 'Param cityId or hotelId or iata is required'
          })
          done()
        })
    })
    it('it should not get all Hotels, error in Dates', (done) => {
      const paramsForHotel = {
        params: {
          sortBy: 'popularity',
          cityId: '6258',
          checkIn: '2019-11-07',
          checkOut: '2019-11-16',
          adultsCount: 2,
          childrenCount: 0
        }
      }
      chai
        .request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_search_management'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.an('Object')
          res.body.should.include.keys('errors')
          res.body.should.have.property('errors').eql({
            msg: 'ERROR_WITH_HOTEL_API'
          })
          done()
        })
    })
    it('it should get all Hotels', (done) => {
      const paramsForHotel = {
        params: {
          sortBy: 'popularity',
          cityId: '6258',
          checkIn: '2021-11-07',
          checkOut: '2021-11-16',
          adultsCount: 2,
          childrenCount: 0
        }
      }
      chai
        .request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_search_management'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.an('Object')
          body.should.have.property('errors').be.an('object')
          const { errors } = body
          errors.should.have.property('msg').eql('ERROR_WITH_HOTEL_API')
          done()
        })
    })
  })

  describe('/POST hotels SEARCH PLACES', () => {
    it('it should not search PLACES, error in params because empty', (done) => {
      const paramsForHotel = {
        params: {
          query: ''
        }
      }
      chai
        .request(server)
        .post('/api/1.0/plugins/travelpayouts-api-hotels/events/search_place')
        .send(paramsForHotel)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.an('object')
          res.body.should.include.keys('errors')
          res.body.should.have
            .property('errors')
            .eql({ msg: 'Param query is required' })
          done()
        })
    })
    it('it should not search PLACES, search is empty', (done) => {
      const paramsForHotel = {
        params: {
          query: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        }
      }
      chai
        .request(server)
        .post('/api/1.0/plugins/travelpayouts-api-hotels/events/search_place')
        .send(paramsForHotel)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('Array')
          res.body.should.have.lengthOf(0)
          done()
        })
    })
    it('it should search PLACES', (done) => {
      const paramsForHotel = {
        params: {
          query: 'medellin'
        }
      }
      chai
        .request(server)
        .post('/api/1.0/plugins/travelpayouts-api-hotels/events/search_place')
        .send(paramsForHotel)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('Array')
          res.body.should.have.lengthOf(5)
          res.body[0].should.include.keys('cityName', 'location', 'countryName')
          res.body[0].should.have.property('cityName').eql('Medellin')
          done()
        })
    })
  })
  describe('/POST hotels COLLECTIONS TYPES', () => {
    it('it should not get collection types, error in id params ', (done) => {
      const paramsForHotel = {
        params: {
          id: ''
        }
      }
      chai
        .request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_types_hotel_collections'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.an('object')
          res.body.should.include.keys('errors')
          res.body.should.have
            .property('errors')
            .eql({ msg: 'Param id is required' })
          done()
        })
    })
    it('it should not get collection types, error in params because empty', (done) => {
      const paramsForHotel = {}
      chai
        .request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_types_hotel_collections'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          res.should.have.status(422)
          res.body.should.be.an('object')
          res.body.should.include.keys('errors')
          done()
        })
    })
    it('it should get collection', (done) => {
      const paramsForHotel = {
        params: {
          id: 3683
        }
      }
      chai
        .request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_types_hotel_collections'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('Array')
          done()
        })
    })
  })
})
