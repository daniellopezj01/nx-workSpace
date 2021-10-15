/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable camelcase */
const md5 = require('md5')
const _ = require('lodash')
const { tap, delay, map, concatMap, retryWhen } = require('rxjs/operators')
const utils = require('../../middleware/utils')

/*********************
 * Private functions *
 *********************/
const errorParam = (reject, key, code = 422, mns = null) => {
  if (mns) {
    reject(utils.buildErrObject(code, mns))
  } else {
    const nameKey = Object.keys(key)
    reject(utils.buildErrObject(code, `Param ${nameKey} is required`))
  }
}

const destructureParamsForUrl = (params) =>
  new Promise((resolve) => {
    let paramUrl = ''
    Object.entries(params).map((a) => {
      paramUrl += a[1] ? `&${a[0]}=${a[1]}` : ''
    })
    resolve(paramUrl)
  })

const paramsSearchAirports = (params) =>
  new Promise((resolve, reject) => {
    const { term, locale, types } = params
    try {
      resolve({
        term: term || errorParam(reject, { term }),
        locale: locale || 'es',
        'types[]': types || ['airport', 'city']
        // 'types[]': types || ['city', 'airport']
      })
    } catch (err) {
      reject(utils.buildErrObject(422, 'ERROR_WITH_PARAMS_AirPorts'))
    }
  })

const checkParamsCheapestTickets = async (params) =>
  new Promise((resolve, reject) => {
    const {
      origin,
      destination,
      depart_date,
      return_date,
      currency,
      page,
      limit
    } = params
    try {
      resolve({
        origin: origin || errorParam(reject, { origin }),
        destination: destination || null,
        depart_date: depart_date || null,
        return_date: return_date || null,
        currency: currency || 'USD',
        token: process.env.API_TOKEN_TRAVELPAYOUTS,
        page: page || 1,
        limit: limit || 10
      })
    } catch (err) {
      reject(utils.buildErrObject(422, 'ERROR_WITH_PARAMS_TICKETS'))
    }
  })

const checkParamsNonStopTicket = async (params) =>
  new Promise((resolve, reject) => {
    try {
      const {
        origin,
        destination,
        depart_date,
        return_date,
        currency,
        page,
        seccion,
        limit
      } = params
      resolve({
        origin: origin || errorParam(reject, { origin }),
        destination: destination || '-',
        depart_date: depart_date || null,
        return_date: return_date || null,
        token: process.env.API_TOKEN_TRAVELPAYOUTS,
        currency: currency || 'USD',
        page: page || 1,
        seccion: seccion || 1,
        limit: limit || 10
      })
    } catch (err) {
      reject(utils.buildErrObject(422, 'ERROR_WITH_PARAMS_TICKETS'))
    }
  })

const checkParamsTicketsForEachDayOfMonth = async (params) =>
  new Promise((resolve, reject) => {
    try {
      const {
        origin,
        destination,
        depart_date,
        return_date,
        currency,
        calendar_type,
        length
      } = params
      resolve({
        origin: origin || errorParam(reject, { origin }),
        destination: destination || errorParam(reject, { destination }),
        depart_date: depart_date || errorParam(reject, { depart_date }),
        return_date: return_date || null,
        calendar_type: calendar_type || errorParam(reject, { calendar_type }),
        length: length || null,
        token: process.env.API_TOKEN_TRAVELPAYOUTS,
        currency: currency || 'USD'
      })
    } catch (err) {
      reject(utils.buildErrObject(422, 'ERROR_WITH_PARAMS_TICKETS'))
    }
  })

const checkParamsCheapestTicketsGroupedByMonth = async (params) => {
  return new Promise((resolve, reject) => {
    try {
      const { origin, destination, currency } = params
      resolve({
        origin: origin || errorParam(reject, { origin }),
        destination: destination || errorParam(reject, { destination }),
        token: process.env.API_TOKEN_TRAVELPAYOUTS,
        currency: currency || 'USD'
      })
    } catch (err) {
      reject(utils.buildErrObject(422, 'ERROR_WITH_PARAMS_TICKETS'))
    }
  })
}

const checkParamsPopularAirlineRoute = async (params) =>
  new Promise((resolve, reject) => {
    try {
      const { airline_code, page, limit } = params
      resolve({
        airline_code: airline_code || errorParam(reject, { airline_code }),
        limit: limit || 10,
        token: process.env.API_TOKEN_TRAVELPAYOUTS,
        page: page || 1
      })
    } catch (err) {
      console.log(err.message)
      reject(utils.buildErrObject(422, 'ERROR_WITH_PARAMS_TICKETS'))
    }
  })

const checkParamsPopularDestinations = async (params) =>
  new Promise((resolve, reject) => {
    try {
      const { origin, limit, currency } = params
      resolve({
        origin: origin || errorParam(reject, { origin }),
        currency: currency || 'USD',
        token: process.env.API_TOKEN_TRAVELPAYOUTS,
        limit: limit || 10
      })
    } catch (err) {
      console.log(err.message)
      reject(utils.buildErrObject(422, 'ERROR_WITH_PARAMS_TICKETS'))
    }
  })

const destructuringProposals = (brandData) =>
  new Promise(async (resolve) => {
    const data = []
    await Promise.all(
      _.map(brandData.proposals, (item) => {
        const transformItem = {}
        transformItem.monetaryData = _.head(
          _.values(_.pick(item.terms, _.first(_.keys(item.terms, 'price'))))
        )
        transformItem.segment = _.map(item.segment, (segmentFlights) => {
          segmentFlights = _.map(segmentFlights.flight, (flight) => {
            flight.dataArrival = brandData.airports[`${flight.arrival}`]
            flight.dataDeparture = brandData.airports[`${flight.departure}`]
            return flight
          })
          return segmentFlights
        })
        transformItem.stops_airports = item.stops_airports
        transformItem.total_duration = item.total_duration
        transformItem.max_stop_duration = item.max_stop_duration
        transformItem.min_stop_duration = item.min_stop_duration
        transformItem.max_stops = item.max_stops
        transformItem.is_direct = item.is_direct
        data.push(transformItem)
        // console.log(transformItem);
      })
    )
    resolve(data)
  })

const transformAllFlights = async (data) => {
  const allObject = {}
  let dataFlight = []
  await Promise.all(
    _.map(data, async (a) => {
      if (a.search_id) {
        allObject.search_id = a.search_id
      }
      const dataBrand = await destructuringProposals(a)
      dataFlight = _.concat(dataFlight, dataBrand)
    })
  ).catch((e) => {
    console.log(e.message)
  })
  allObject.data = dataFlight
  return allObject
}

const checkParamsFlights = (params) =>
  new Promise((resolve, reject) => {
    try {
      const {
        passengers,
        segments,
        host,
        user_ip,
        locale,
        trip_class,
        currency
      } = params
      let { adults, children, infants } = passengers
      adults = adults || 1
      children = children || 0
      infants = infants || 0
      params.segments.forEach((a) => {
        let { origin, destination, date } = a
        origin = origin || errorParam(reject, { origin }) // TODO-------------------------------------------- AQUI estaba errorParam()
        destination = destination || errorParam(reject, { destination }) // TODO-------------------------------------------- AQUI estaba errorParam()
        date = date || errorParam(reject, { date }) // TODO-------------------------------------------- AQUI estaba errorParam()
      })
      resolve({
        signature: '',
        marker: process.env.MARKER_TRAVELPAYOUTS,
        host: process.env.TRAVEL_HOST || 'beta.aviasales.ru', // TODO-------------------------------------------- AQUI estaba errorParam()
        user_ip: user_ip || '127.0.0.1', // TODO-------------------------------------------- AQUI estaba errorParam()
        locale: locale || 'en',
        trip_class: trip_class || 'Y',
        passengers,
        segments,
        currency: currency || 'USD'
      })
    } catch (error) {
      reject(false)
    }
  })

const createMd5Signature = (query) => {
  try {
    const {
      currency,
      host,
      locale,
      marker,
      passengers,
      trip_class,
      user_ip,
      segments
    } = query
    const { adults, infants, children } = passengers
    // eslint-disable-next-line max-len
    let signature = `${process.env.API_TOKEN_TRAVELPAYOUTS}:${currency}:${host}:${locale}:${marker}:${adults}:${children}:${infants}`
    segments.forEach((a) => {
      const { date, destination, origin } = a
      signature = `${signature}:${date}:${destination}:${origin}`
    })
    signature = `${signature}:${trip_class}:${user_ip}`
    return md5(signature)
  } catch (error) {
    return null
  }
}

/********************
 * Public functions *
 ********************/

/**
 * search airports
 * Docs here
 * https://support.travelpayouts.com/hc/en-us/articles/360002322572-Autocomplete-API-for-countries-cities-and-airports
 */
exports.search_airports = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = await paramsSearchAirports(params)
      const root = 'http://autocomplete.travelpayouts.com/places2?'
      const queryParams = await destructureParamsForUrl(query)
      const url = `${root}${queryParams}`
      const data = await utils.httpRequest(url, 'get')
      let newData = _.sortBy(data, ['type'])
      newData = _.take(_.uniqBy(newData, 'code'), params.limit || 10)
      resolve(newData)
    } catch (error) {
      console.log(error.message)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })
}

/**
 * @param {Object} params
 * CHEAPEST TICKETS
 * Docs here
 * https://support.travelpayouts.com/hc/en-us/articles/203956163-Travel-insights-with-Travelpayouts-Data-API#cheapest_tickets
 */
exports.cheapest_tickets = async (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const query = await checkParamsCheapestTickets(params)
      const root = 'https://api.travelpayouts.com/v1/prices/cheap?'
      const queryParams = await destructureParamsForUrl(query)
      const url = `${root}${queryParams}`
      const data = await utils.httpRequest(url, 'get')
      resolve(data)
    } catch (error) {
      console.log(error.message)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })

/**
 * @param {Object} params
 * Non-stop tickets
 * Docs here
 * https://support.travelpayouts.com/hc/en-us/articles/203956163-Travel-insights-with-Travelpayouts-Data-API#non_stop_tickets
 */
exports.non_stop_ticket = async (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const query = await checkParamsNonStopTicket(params)
      const root = 'https://api.travelpayouts.com/v1/prices/direct?'
      const queryParams = await destructureParamsForUrl(query)
      const url = `${root}${queryParams}`
      const data = await utils.httpRequest(url, 'get')
      resolve(data)
    } catch (error) {
      console.log(error.message)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })
/**
 * @param {Object} params -
 * Flight price trends
 * Docs here
 * https://support.travelpayouts.com/hc/en-us/articles/203956163-Travel-insights-with-Travelpayouts-Data-API#tickets_for_each_day_of_month
 */
exports.Flight_price_trends = async (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const query = await checkParamsTicketsForEachDayOfMonth(params)
      const root = 'https://api.travelpayouts.com/v1/prices/calendar?'
      const queryParams = await destructureParamsForUrl(query)
      const url = `${root}${queryParams}`
      const data = await utils.httpRequest(url, 'get')
      resolve(data)
    } catch (error) {
      console.log(error.message)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })

/**
 * @param {Object} params -
 * Cheapest tickets grouped by month
 * Docs here
 * https://support.travelpayouts.com/hc/en-us/articles/203956163-Travel-insights-with-Travelpayouts-Data-API#cheapest_tickets_grouped_month
 */
exports.cheapest_tickets_Month = async (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const query = await checkParamsCheapestTicketsGroupedByMonth(params)
      const root = 'http://api.travelpayouts.com/v1/prices/monthly?'
      const queryParams = await destructureParamsForUrl(query)
      const url = `${root}${queryParams}`
      const data = await utils.httpRequest(url, 'get')
      resolve(data)
    } catch (error) {
      console.log(error.message)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })

/**
 * @param {Object} params
 * Popular airline routes
 * Docs here
 * https://support.travelpayouts.com/hc/en-us/articles/203956163-Travel-insights-with-Travelpayouts-Data-API#popular_airline_routes
 */
exports.popular_Airline_Routes = async (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const query = await checkParamsPopularAirlineRoute(params)
      const root = 'https://api.travelpayouts.com/v1/airline-directions?'
      const queryParams = await destructureParamsForUrl(query)
      const url = `${root}${queryParams}`
      const data = await utils.httpRequest(url, 'get')
      resolve(data)
    } catch (error) {
      console.log(error.message)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })
/**
 * @param {Object} params
 * The popular destinations
 * Docs here
 * https://support.travelpayouts.com/hc/en-us/articles/203956163-Travel-insights-with-Travelpayouts-Data-API#the_popular_directions_from_a_city
 */
exports.popular_destinations = async (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const query = await checkParamsPopularDestinations(params)
      const { token, origin, currency } = query
      const root = 'https://api.travelpayouts.com/v1/city-directions?'
      const queryParams = `currency=${currency}&origin=${origin}&token=${token}`
      const url = `${root}${queryParams}`
      const data = await utils.httpRequest(url, 'get')
      resolve(data)
    } catch (error) {
      console.log(error.message)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })

/***********************************
 * Real-time and multi-city search *
 ***********************************/
/**
 * @param {Object} params
 * Round trip
 * Docs here
 * https://support.travelpayouts.com/hc/en-us/articles/203956173-Flights-search-API-Real-time-and-multi-city-search#01

 * Implement rxjs
 * @param {*} params
 */
exports.get_flights = (params) =>
  new Promise(async (resolve, reject) => {
    try {
      let currency_exchange
      let search_id
      const query = await checkParamsFlights(params)
      query.signature = createMd5Signature(query)
      query.host = process.env.TRAVEL_HOST
      const url = 'https://api.travelpayouts.com/v1/flight_search'
      const finalHttp$ = utils
        .httpRequest$(
          url,
          'post',
          {
            headers: {
              'Axios-Redis-Cache-Duration': null
            }
          },
          query
        )
        .pipe(
          tap((t) => {
            searchId = t.search_id
            currency_exchange = t.currency_rates
          }),
          concatMap((resultFirst) =>
            utils
              .httpRequest$(
                `https://api.travelpayouts.com/v1/flight_search_results?uuid=${resultFirst.search_id}`,
                'get'
              )
              .pipe()
          ),
          retryWhen((errors) =>
            errors.pipe(
              tap((errorStatus) => {
                console.log('errorStatus', errorStatus.message)
                if (!['409'].includes(`${errorStatus.response.status}`)) {
                  throw errorStatus
                }
                console.log('Retrying...')
              })
            )
          )
        )
      finalHttp$.subscribe(
        async (data) => {
          if (data.length) {
            const finishRequest = !Object.prototype.hasOwnProperty.call(
              data[data.length - 1],
              'proposals'
            )
            data = await transformAllFlights(data)
            data.finish = finishRequest
          } else {
            data.finish = true
          }
          _.forEach(data.data, (o) => {
            o.currency_exchange = currency_exchange
            o.searchId = searchId
            o.price = o.monetaryData.unified_price
          })

          data.currency_exchange = currency_exchange
          data.data = _.sortBy(data.data, 'monetaryData.price')
          // console.log(_.map(data.data,'monetaryData.url'));
          resolve(data)
        },
        (err) => {
          console.log(err.message)
          reject(utils.buildErrObject('422', 'ERROR_WITH_FLIGHTS_API'))
        }
      )
    } catch (error) {
      reject(utils.buildErrObject(error.code, error.message))
    }
  })

exports.all_info_flight = async (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const { search_id } = params
      if (!search_id) {
        errorParam(reject, { search_id })
      }
      const url = `https://api.travelpayouts.com/v1/flight_search_results?uuid=${search_id}`
      const finalHttp$ = utils
        .httpRequest$(url, 'get', {
          headers: {
            'Axios-Redis-Cache-Duration': null
          }
        })
        .pipe(
          map(async (newData) => {
            const lastKey = _.head(_.keys(_.last(newData)))
            const finish = lastKey === 'search_id'
            newData = await transformAllFlights(newData)
            newData.finish = finish
            return newData
          }),
          retryWhen((res) =>
            res.pipe(
              delay(1000),
              tap(async (t) => {
                console.log('entre a retry when', t.message)
              })
            )
          )
        )
      finalHttp$.subscribe(
        async (res) => {
          res.then((data) => {
            _.forEach(data.data, (o) => {
              o.searchId = search_id
              o.price = o.monetaryData.unified_price
            })
            data.finish = data.finish
            data.raw = data.raw
            data.data = _.sortBy(data.data, 'monetaryData.price')
            resolve(data)
          })
        },
        (err) => {
          console.log(err.message)
          reject(utils.buildErrObject('422', 'ERROR_WITH_FLIGHTS_API'))
        }
      )
    } catch (error) {
      console.log(error.message)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })

/**
 * @param {string} params
 * Docs here
 * SECTION TWO
 * https://support.travelpayouts.com/hc/en-us/articles/203956173-Flights-search-API-Real-time-and-multi-city-search#01
 */

// exports.all_info_flight = async (params) => new Promise(async (resolve, reject) => {
//   try {
//     const { search_id } = params
//     if (!search_id) errorParam(reject, { search_id })
//     const url = `https://api.travelpayouts.com/v1/flight_search_results?uuid=${search_id}`
//     let newData = await utils.httpRequest(url, 'get')
//     if (newData.length) {
//       const finishRequest = !Object.prototype.hasOwnProperty.call(
//         newData[newData.length - 1],
//         'proposals'
//       )
//       newData = await transformAllFlights(newData)
//       newData.finish = finishRequest
//     } else {
//       newData.finish = true
//     }
//     newData.data = _.sortBy(newData.data, 'monetaryData.price')
//     resolve(newData)
//   } catch (error) {
//     console.log(error)
//     reject(utils.buildErrObject(error.code, error.message))
//   }
// })

/**
 * @param {string} search_id
 * Docs here
 * SECTION THREEE
 * https://support.travelpayouts.com/hc/en-us/articles/203956173-Flights-search-API-Real-time-and-multi-city-search#u1
 */
exports.pay_referencial = async (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const { search_id, term_url } = params
      if (!search_id) {
        errorParam(reject, { search_id })
      }
      if (!term_url) {
        errorParam(reject, { term_url })
      }
      const url = `https://api.travelpayouts.com/v1/flight_searches/${search_id}/clicks/${term_url}`
      const data = await utils.httpRequest(url, 'get')
      resolve(data)
    } catch (error) {
      console.log(error.message)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })
