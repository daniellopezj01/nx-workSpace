// /* eslint-disable import/no-extraneous-dependencies */
// /* eslint-disable no-undef */

// process.env.NODE_ENV = 'test'
// const _ = require('lodash')
// const faker = require('faker')
// const chai = require('chai')
// const chaiHttp = require('chai-http')
// const server = require('../../server')
// // eslint-disable-next-line no-unused-vars
// const should = chai.should()
// let flight = ''
// const oldSearchId = '140f2e6e-5f31-4f56-ad71-1511c06138b1'
// let currentSearchId = ''
// const url = '/api/1.0/plugins/travelpayouts-api-fligths/events'


// describe('*********** FLIGHTS ***********', () => {
//   describe('/POST POPULAR ROUTES FOR AIRLINE', () => {
//     test('it should not get flights For type, error in params because empty', (done) => {
//       const paramsForType = {}
//       chai
//         .request(server)
//         .post(
//           `${url}/popular_Airline_Routes`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           done()
//         })
//     })
//     it('NOT Exist airline', (done) => {
//       const paramsForType = {
//         params: {
//           airline_code: 'SUUU'
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/popular_Airline_Routes`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.errors.msg.should.include.keys('error', 'success', 'data')
//           res.body.errors.msg.should.have.property('success').eql(false)
//           res.body.errors.msg.should.have.property('data').eql(null)
//           done()
//         })
//     })
//     test('it get routes for airline, default limit', (done) => {
//       const paramsForType = {
//         params: {
//           airline_code: 'SU'
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/popular_Airline_Routes`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('error', 'success', 'data')
//           res.body.should.have.property('success').eql(true)
//           res.body.should.have.property('data').be.an('Object')
//           res.body.should.have.property('error').eql(null)
//           done()
//         })
//     })
//     test('it get routes for airline, with limit', (done) => {
//       const limit = 5
//       const paramsForType = {
//         params: {
//           airline_code: 'SU',
//           limit
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/popular_Airline_Routes`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('error', 'success', 'data')
//           res.body.should.have.property('success').eql(true)
//           res.body.should.have.property('data').be.a('Object')
//           res.body.should.have.property('error').eql(null)
//           done()
//         })
//     })
//   })

//   describe('/POST POPULAR DESTINATIONS', () => {
//     test('it should not get flights For type, error in params because empty', (done) => {
//       const paramsForType = {}
//       chai
//         .request(server)
//         .post(
//           `${url}/popular_destinations`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.should.have
//             .property('errors')
//             .eql({ msg: 'ERROR_WITH_PARAMS_TICKETS' })
//           done()
//         })
//     })
//     test('it should not get flights For type, error in param Origin', (done) => {
//       const paramsForType = {
//         params: {}
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/popular_destinations`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.should.have
//             .property('errors')
//             .eql({ msg: 'Param origin is required' })
//           done()
//         })
//     })
//     it('NOT Exist ORIGIN', (done) => {
//       const paramsForType = {
//         params: {
//           origin: 'BOGGG'
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/popular_destinations`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.errors.msg.should.include.keys('error', 'success', 'data')
//           res.body.errors.msg.should.have.property('success').eql(false)
//           res.body.errors.msg.should.have.property('data').eql(null)
//           done()
//         })
//     })
//     test('it get popular destinations for Airport', (done) => {
//       const paramsForType = {
//         params: {
//           origin: 'BOG'
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/popular_destinations`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('object')
//           console.log(Object.keys(res.body))
//           res.body.should.include.keys('currency', 'success', 'data')
//           res.body.should.have.property('success').eql(true)
//           res.body.should.have.property('data').be.an('Object')
//           res.body.should.have
//             .property('success')
//             .eql(!_.isEmpty(res.body.data))
//           done()
//         })
//     })
//   })

//   describe('/POST SEARCH AIRPORT', () => {
//     test('it should not search airport, error in params because empty', (done) => {
//       const paramsForType = {}
//       chai
//         .request(server)
//         .post(
//           `${url}/search_airports`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           done()
//         })
//     })
//     test('it should not search airport, error in param term', (done) => {
//       const paramsForType = {
//         params: {}
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/search_airports`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.should.have
//             .property('errors')
//             .eql({ msg: 'Param term is required' })
//           done()
//         })
//     })
//     test('it should not fing airport, error in term', (done) => {
//       const paramsForType = {
//         params: {
//           term: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/search_airports`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('Array')
//           res.body.should.have.lengthOf(0)
//           done()
//         })
//     })
//     test('it get Airport for term ', (done) => {
//       const paramsForType = {
//         params: {
//           term: 'medellin'
//         }
//       }
//       // two airports in medellin
//       chai
//         .request(server)
//         .post(
//           `${url}/search_airports`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('Array')
//           _.map(res.body, (a, b) => {
//             res.body[b].should.include.keys(
//               'coordinates',
//               'city_code',
//               'city_name',
//               'name'
//             )
//             res.body[b].should.have.property('city_code').eql('MDE')
//             res.body[b].should.have.property('city_name').eql('Medellín')
//           })
//           done()
//         })
//     })
//   })

//   describe('/POST CHEAPEST TICKETS', () => {
//     test('it should not cheapest tickets, error in params because empty', (done) => {
//       const paramsForType = {}
//       chai
//         .request(server)
//         .post(
//           `${url}/cheapest_tickets`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           done()
//         })
//     })
//     test('it should not cheapest tickets, error in param origin', (done) => {
//       const paramsForType = {
//         params: {
//           destination: 'MDE',
//           depart_date: '2020-11',
//           page: 1
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/cheapest_tickets`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.should.have
//             .property('errors')
//             .eql({ msg: 'Param origin is required' })
//           done()
//         })
//     })
//     test('it should not cheapest tickets, error in Dates', (done) => {
//       const paramsForType = {
//         params: {
//           origin: 'BOG',
//           destination: 'MDE',
//           depart_date: '2020-01',
//           page: 1
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/cheapest_tickets`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('currency', 'success', 'data')
//           res.body.should.have.property('success').eql(true)
//           res.body.should.have.property('data').be.a('Object')
//           done()
//         })
//     })
//     test('it should fetch cheapest tickets ', (done) => {
//       const paramsForType = {
//         params: {
//           origin: 'BOG',
//           destination: 'MDE',
//           depart_date: '2022-01',
//           page: 1
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/cheapest_tickets`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('currency', 'success', 'data')
//           res.body.should.have.property('success').eql(true)
//           res.body.should.have.property('data').be.a('Object')
//           done()
//         })
//     })
//   })

//   describe('/POST_TRENDS_PRICE', () => {
//     test('it should not trends price, error in params because empty', (done) => {
//       const paramsForType = {}
//       chai
//         .request(server)
//         .post(
//           `${url}/Flight_price_trends`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.should.have
//             .property('errors')
//             .eql({ msg: 'ERROR_WITH_PARAMS_TICKETS' })
//           done()
//         })
//     })
//     test('it should not trends price, error in param origin', (done) => {
//       const paramsForType = {
//         params: {
//           destination: 'MAD',
//           depart_date: '2020-11',
//           calendar_type: 'departure_date',
//           currency: 'COP'
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/Flight_price_trends`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.should.have
//             .property('errors')
//             .eql({ msg: 'Param origin is required' })
//           done()
//         })
//     })
//     test('it should not trends price, error in Dates', (done) => {
//       const paramsForType = {
//         params: {
//           origin: 'BOG',
//           destination: 'MAD',
//           depart_date: '2020-10',
//           calendar_type: 'departure_date',
//           currency: 'COP'
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/Flight_price_trends`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('currency', 'success', 'data')
//           res.body.should.have.property('success').eql(true)
//           res.body.should.have.property('data').be.a('Object')
//           done()
//         })
//     })
//     test('it should fetch trends price', (done) => {
//       const paramsForType = {
//         params: {
//           origin: 'BOG',
//           destination: 'MAD',
//           depart_date: '2025-03',
//           calendar_type: 'departure_date',
//           currency: 'COP'
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/Flight_price_trends`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('currency', 'success', 'data')
//           res.body.should.have.property('success').eql(true)
//           res.body.should.have.property('data').be.a('Object')
//           done()
//         })
//     })
//   })

//   describe('/POST TRENDS PRICE MONTH', () => {
//     test('it should not trends price month, error in params because empty', (done) => {
//       const paramsForType = {}
//       chai
//         .request(server)
//         .post(
//           `${url}/cheapest_tickets_Month`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.should.have
//             .property('errors')
//             .eql({ msg: 'ERROR_WITH_PARAMS_TICKETS' })
//           done()
//         })
//     })
//     test('it should not trends price month, error in param origin', (done) => {
//       const paramsForType = {
//         params: {
//           destination: 'MAD',
//           depart_date: '2020-11',
//           calendar_type: 'departure_date',
//           currency: 'COP'
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/cheapest_tickets_Month`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.should.have
//             .property('errors')
//             .eql({ msg: 'Param origin is required' })
//           done()
//         })
//     })
//     test('it should not trends price month, error in origin not exists', (done) => {
//       const paramsForType = {
//         params: {
//           origin: 'BOGGGG',
//           destination: 'MDE',
//           currency: 'COP'
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/cheapest_tickets_Month`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.errors.msg.should.include.keys('error', 'success', 'data')
//           res.body.errors.msg.should.have.property('success').eql(false)
//           res.body.errors.msg.should.have.property('data').eql(null)
//           done()
//         })
//     })
//     test('it should fetch trends price month', (done) => {
//       const paramsForType = {
//         params: {
//           origin: 'BOG',
//           destination: 'MDE',
//           currency: 'COP'
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/cheapest_tickets_Month`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('currency', 'success', 'data')
//           res.body.should.have.property('success').eql(true)
//           res.body.should.have.property('data').be.a('Object')
//           res.body.should.have
//             .property('success')
//             .eql(!_.isEmpty(res.body.data))
//           done()
//         })
//     })
//   })

//   describe('/POST GET FLIGHTS', () => {
//     test('it should not get flights, error in params because empty', (done) => {
//       const paramsForType = {}
//       chai
//         .request(server)
//         .post(`${url}/get_flights`)
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           console.log(res.body)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.should.have.property('errors').eql({ msg: 'ERROR_INTERNAL' })
//           done()
//         })
//     })
//     test('it should not get flights, error in params', (done) => {
//       const paramsForType = {
//         params: {}
//       }
//       chai
//         .request(server)
//         .post(`${url}/get_flights`)
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.should.have.property('errors').eql({ msg: 'ERROR_INTERNAL' })
//           done()
//         })
//     })
//     test('it should not get flights, params incompleted', (done) => {
//       const paramsForType = {
//         params: {
//           host: 'beta.aviasales.ru',
//           user_ip: '127.0.0.1',
//           currency: 'COP',
//           locale: 'es',
//           passengers: {
//             adults: 2,
//             children: 0,
//             infants: 0
//           }
//         }
//       }
//       chai
//         .request(server)
//         .post(`${url}/get_flights`)
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.should.have.property('errors').eql({ msg: 'ERROR_INTERNAL' })
//           done()
//         })
//     })
//     test('it should not get flights, error in dates', (done) => {
//       const paramsForType = {
//         params: {
//           host: 'beta.aviasales.ru',
//           user_ip: '127.0.0.1',
//           currency: 'COP',
//           locale: 'es',
//           passengers: {
//             adults: 2,
//             children: 0,
//             infants: 0
//           },
//           segments: [
//             {
//               origin: 'MDE',
//               destination: 'BOG',
//               date: '2020-04-25'
//             }
//           ]
//         }
//       }
//       chai
//         .request(server)
//         .post(`${url}/get_flights`)
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.should.have
//             .property('errors')
//             .eql({ msg: 'ERROR_WITH_FLIGHTS_API' })
//           done()
//         })
//     })
//     test('it should get flights', (done) => {
//       const paramsForType = {
//         params: {
//           host: 'beta.aviasales.ru',
//           user_ip: '127.0.0.1',
//           currency: 'COP',
//           locale: 'es',
//           passengers: {
//             adults: 2,
//             children: 0,
//             infants: 0
//           },
//           segments: [
//             {
//               origin: 'MDE',
//               destination: 'BOG',
//               date: '2021-08-25'
//             }
//           ]
//         }
//       }
//       chai
//         .request(server)
//         .post(`${url}/get_flights`)
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('finish', 'search_id', 'data')
//           currentSearchId = res.body.search_id
//           res.body.should.have.property('data').be.a('Array')
//           flight = res.body.data[0]
//           _.map(res.body.data, (a) => {
//             a.should.include.keys('monetaryData', 'segment')
//             // a.should.include.keys('monetaryData', 'segment')
//           })
//           done()
//         })
//     })
//   })

//   describe('/POST GET ALL FLIGHTS', () => {
//     test('it should not get ALL lights, error in params because empty', (done) => {
//       const paramsForType = {}
//       chai
//         .request(server)
//         .post(
//           `${url}/all_info_flight`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           done()
//         })
//     })
//     test('it should not get ALL flights, error in params', (done) => {
//       const paramsForType = {
//         params: {}
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/all_info_flight`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.should.have
//             .property('errors')
//             .eql({ msg: 'Param search_id is required' })
//           done()
//         })
//     })
//     test('it should not get ALL flights, old search id', (done) => {
//       const paramsForType = {
//         params: {
//           search_id: oldSearchId
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/all_info_flight`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('data', 'finish')
//           // res.body.should.have.property('finish').eql(true)
//           res.body.data.should.be.an('Array')
//           res.body.data.should.have.lengthOf(0)
//           done()
//         })
//     })
//     test('it should get ALL flights', (done) => {
//       const paramsForType = {
//         params: {
//           search_id: currentSearchId
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/all_info_flight`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('object')
//           // res.body.should.include.keys('data', 'search_id', 'finish')
//           res.body.should.have.property('data').be.a('Array')
//           res.body.should.have.property('search_id').eql(currentSearchId)
//           done()
//         })
//     })
//   })

//   describe('/POST PAY_REFERENCIAL', () => {
//     test('it should not get pay referencial, error in params because empty', (done) => {
//       const paramsForType = {}
//       chai
//         .request(server)
//         .post(
//           `${url}/pay_referencial`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           done()
//         })
//     })
//     test('it should not get pay referencial, error in params', (done) => {
//       const paramsForType = {
//         params: {
//           search_id: oldSearchId
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/pay_referencial`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           res.body.should.have
//             .property('errors')
//             .eql({ msg: 'Param term_url is required' })
//           done()
//         })
//     })
//     test('it should not get URL, old params', (done) => {
//       const paramsForType = {
//         params: {
//           search_id: oldSearchId,
//           term_url: faker.random.number()
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/pay_referencial`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(422)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('errors')
//           done()
//         })
//     })
//     test('it should  get URL pay_referencial', (done) => {
//       const paramsForType = {
//         params: {
//           search_id: currentSearchId,
//           term_url: flight.monetaryData.url
//         }
//       }
//       chai
//         .request(server)
//         .post(
//           `${url}/pay_referencial`
//         )
//         .send(paramsForType)
//         .end((err, res) => {
//           res.should.have.status(200)
//           res.body.should.be.an('object')
//           res.body.should.include.keys('url', 'click_id')
//           done()
//         })
//     })
//   })
// })
