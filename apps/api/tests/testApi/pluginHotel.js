/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'
const _ = require('lodash')


const server = require('../../server')



describe('*********** HOTELS_USERS ***********', () => {
  describe('/POST hotels For type', () => {
    it(
      'it should not get Hotels For type, error in params because empty',
      (done) => {
        const paramsForType = {}
        request(server)
          .post(
            '/api/1.0/plugins/travelpayouts-api-hotels/events/get_hotels_selections'
          )
          .send(paramsForType)
          .end((err, res) => {
            expect(res).have.status(422)
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toEqual(expect.arrayContaining('errors'))
            done()
          })
      }
    )
    it(
      'it should not get Hotels For type, error in params, property is missing',
      (done) => {
        const paramsForType = {
          params: {
            check_out: '2021-08-03',
            language: 'es',
            type: 'populary',
            limit: '5',
            id: '6230' // id city
          }
        }
        request(server)
          .post(
            '/api/1.0/plugins/travelpayouts-api-hotels/events/get_hotels_selections'
          )
          .send(paramsForType)
          .end((err, res) => {
            expect(res).have.status(422)
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toEqual(expect.arrayContaining('errors'))
            expect(res.body).have.property('errors').toEqual({
              msg: 'Param check_in is required'
            })

            done()
          })
      }
    )
    test('it should get Hotels For type', (done) => {
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
      request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_hotels_selections'
        )
        .send(paramsForType)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining('populary'))
          expect(res.body.populary).toBeInstanceOf(Array)
          expect(res.body.populary).toHaveLength(5)
          done()
        })
    })
  })

  describe('/POST hotels For PRICE', () => {
    const locationId = 3683
    it(
      'it should not get Hotels For PRICE, error in params because empty',
      (done) => {
        const paramsForHotel = {}
        request(server)
          .post(
            '/api/1.0/plugins/travelpayouts-api-hotels/events/get_cost_in_hotels'
          )
          .send(paramsForHotel)
          .end((err, res) => {
            expect(res).have.status(422)
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toEqual(expect.arrayContaining('errors'))
            done()
          })
      }
    )
    it(
      'it should not get Hotels For PRICE, error in params, property is missing',
      (done) => {
        const paramsForHotel = {
          params: {
            locationId,
            checkOut: '2020-10-15',
            limit: '1000'
          }
        }
        request(server)
          .post(
            '/api/1.0/plugins/travelpayouts-api-hotels/events/get_cost_in_hotels'
          )
          .send(paramsForHotel)
          .end((err, res) => {
            expect(res).have.status(422)
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toEqual(expect.arrayContaining('errors'))
            expect(res.body).have.property('errors').toEqual({
              msg: 'Param checkIn is required'
            })
            done()
          })
      }
    )
    test('it should not get Hotels For PRICE, error in Dates', (done) => {
      const paramsForHotel = {
        params: {
          locationId,
          checkIn: '2020-10-01',
          checkOut: '2020-10-15',
          limit: '10'
        }
      }
      request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_cost_in_hotels'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Array)
          expect(res.body).toHaveLength(0)
          done()
        })
    })
    test('it should get Hotels For PRICE', (done) => {
      const paramsForHotel = {
        params: {
          locationId,
          checkIn: '2021-10-01',
          checkOut: '2021-10-15',
          limit: '10'
        }
      }
      request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_cost_in_hotels'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Array)
          expect(res.body).toHaveLength(10)
          _.map(res.body, (a, b) => {
            expect(res.body[b]).toEqual(expect.arrayContaining(['location', 'pricePercentile']))
          })
          done()
        })
    })
  })
  describe('/POST hotels ALL HOTELS', () => {
    test('it should not get all Hotels, error in params because empty', (done) => {
      const paramsForHotel = {}
      request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_search_management'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          expect(res).have.status(422)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining('errors'))
          done()
        })
    })
    it(
      'it should not get all Hotels, error in params, property is missing',
      (done) => {
        const paramsForHotel = {
          params: {
            sortBy: 'popularity',
            checkIn: '2020-11-07',
            checkOut: '2020-11-16',
            adultsCount: 2,
            childrenCount: 0
          }
        }
        request(server)
          .post(
            '/api/1.0/plugins/travelpayouts-api-hotels/events/get_search_management'
          )
          .send(paramsForHotel)
          .end((err, res) => {
            expect(res).have.status(422)
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toEqual(expect.arrayContaining('errors'))
            expect(res.body).have.property('errors').toEqual({
              msg: 'Param cityId or hotelId or iata is required'
            })
            done()
          })
      }
    )
    test('it should not get all Hotels, error in Dates', (done) => {
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
      request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_search_management'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          expect(res).have.status(422)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining('errors'))
          expect(res.body).have.property('errors').toEqual({
            msg: 'ERROR_WITH_HOTEL_API'
          })
          done()
        })
    })
    test('it should get all Hotels', (done) => {
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
      request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_search_management'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
          expect(body).toBeInstanceOf(Object)
          expect(body).toBeInstanceOf(Object)
          const { errors } = body
          expect(errors).have.property('msg').toBe('ERROR_WITH_HOTEL_API')
          done()
        })
    })
  })

  describe('/POST hotels SEARCH PLACES', () => {
    test('it should not search PLACES, error in params because empty', (done) => {
      const paramsForHotel = {
        params: {
          query: ''
        }
      }
      request(server)
        .post('/api/1.0/plugins/travelpayouts-api-hotels/events/search_place')
        .send(paramsForHotel)
        .end((err, res) => {
          expect(res).have.status(422)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining('errors'))
          expect(res.body).have
            .property('errors').toEqual({ msg: 'Param query is required' })
          done()
        })
    })
    test('it should not search PLACES, search is empty', (done) => {
      const paramsForHotel = {
        params: {
          query: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        }
      }
      request(server)
        .post('/api/1.0/plugins/travelpayouts-api-hotels/events/search_place')
        .send(paramsForHotel)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Array)
          expect(res.body).toHaveLength(0)
          done()
        })
    })
    test('it should search PLACES', (done) => {
      const paramsForHotel = {
        params: {
          query: 'medellin'
        }
      }
      request(server)
        .post('/api/1.0/plugins/travelpayouts-api-hotels/events/search_place')
        .send(paramsForHotel)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Array)
          expect(res.body).toHaveLength(5)
          expect(res.body[0]).toEqual(expect.arrayContaining(['cityName', 'location', 'countryName']))
          expect(res.body[0]).have.property('cityName').toBe('Medellin')
          done()
        })
    })
  })
  describe('/POST hotels COLLECTIONS TYPES', () => {
    test('it should not get collection types, error in id params ', (done) => {
      const paramsForHotel = {
        params: {
          id: ''
        }
      }
      request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_types_hotel_collections'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          expect(res).have.status(422)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining('errors'))
          expect(res.body).have
            .property('errors').toEqual({ msg: 'Param id is required' })
          done()
        })
    })
    it(
      'it should not get collection types, error in params because empty',
      (done) => {
        const paramsForHotel = {}
        request(server)
          .post(
            '/api/1.0/plugins/travelpayouts-api-hotels/events/get_types_hotel_collections'
          )
          .send(paramsForHotel)
          .end((err, res) => {
            expect(res).have.status(422)
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toEqual(expect.arrayContaining('errors'))
            done()
          })
      }
    )
    test('it should get collection', (done) => {
      const paramsForHotel = {
        params: {
          id: 3683
        }
      }
      request(server)
        .post(
          '/api/1.0/plugins/travelpayouts-api-hotels/events/get_types_hotel_collections'
        )
        .send(paramsForHotel)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Array)
          done()
        })
    })
  })
})
