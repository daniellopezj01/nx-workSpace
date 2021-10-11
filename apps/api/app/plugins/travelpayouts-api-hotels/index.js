/* eslint-disable camelcase */
const md5 = require('md5')
const _ = require('lodash')
const {
  tap, delay, retryWhen, switchMap
} = require('rxjs/operators')
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

const clearString = (string) => {
  let newString = string.replace
  newString = string.replace(/(\r\n|\n|\r)/gm, '')
  newString = string.replace(/\s/g, '')
  return newString
}

const destructuringParamsForUrl = (params) => new Promise((resolve) => {
  let paramUrl = ''
  Object.entries(params).map((a) => {
    paramUrl += a[1] ? `&${a[0]}=${a[1]}` : ''
  })
  paramUrl = paramUrl.split('')
  paramUrl = paramUrl.slice(1)
  paramUrl = paramUrl.join('')
  resolve(paramUrl)
})

const checkParamsHotelsByNameOrLocation = async (params) => new Promise((resolve, reject) => {
  try {
    const {
      query, lang, lookFor, limit, convertCase
    } = params
    resolve({
      query: query || errorParam(reject, { query }),
      lang: lang || 'en',
      lookFor: lookFor || 'city',
      limit: limit || 5,
      convertCase: convertCase || 0,
      token: process.env.API_TOKEN_TRAVELPAYOUTS
    })
  } catch (error) {
    reject(utils.buildErrObject(400, error.message))
  }
})

const checkParamsCostOfLivinInHotels = async (params) => new Promise((resolve, reject) => {
  try {
    const {
      location,
      checkIn,
      checkOut,
      locationId,
      hotelId,
      hotel,
      adults,
      children,
      infants,
      limit,
      customerIp,
      currency
    } = params
    resolve({
      location: location || null,
      checkIn: checkIn || errorParam(reject, { checkIn }),
      checkOut: checkOut || errorParam(reject, { checkOut }),
      locationId:
        locationId || (!location ? errorParam(reject, { checkIn }) : null),
      hotelId: hotelId || null,
      hotel: hotel || null,
      adults: adults || null,
      children: children || null,
      infants: infants || null,
      limit: limit || null,
      customerIp: customerIp || null,
      currency: currency || null,
      token: process.env.API_TOKEN_TRAVELPAYOUTS
    })
  } catch (error) {
    reject(utils.buildErrObject(400, error.message))
  }
})

// const checkParamsHotelsInArchive = async (params) => new Promise((resolve, reject) => {
//   try {
//     const { language } = params
//     resolve({
//       language: language || errorParam(reject, { language }),
//       token: process.env.API_TOKEN_TRAVELPAYOUTS
//     })
//   } catch (error) {
//     reject(utils.buildErrObject(400, error.message))
//   }
// })

const checkParamsHotelsSelections = async (params) => new Promise((resolve, reject) => {
  try {
    const {
      check_in,
      check_out,
      currency,
      language,
      limit,
      type,
      id
    } = params
    resolve({
      check_in: check_in || errorParam(reject, { check_in }),
      check_out: check_out || errorParam(reject, { check_out }),
      currency: currency || 'usd',
      language: language || 'en',
      limit: limit || 20,
      type: type || errorParam(reject, { type }),
      id: id || errorParam(reject, { id }),
      token: process.env.API_TOKEN_TRAVELPAYOUTS
    })
  } catch (error) {
    reject(utils.buildErrObject(400, error.message))
  }
})

const checkParamsTypesHotelCollections = async (params) => new Promise((resolve, reject) => {
  try {
    const { id } = params
    resolve({
      id: id || errorParam(reject, { id }),
      token: process.env.API_TOKEN_TRAVELPAYOUTS
    })
  } catch (error) {
    console.log(error.message)
    reject(utils.buildErrObject(400, error.message))
  }
})

const checkedSearchManagement = async (params) => new Promise((resolve, reject) => {
  try {
    const {
      cityId,
      hotelId,
      iata,
      checkIn,
      checkOut,
      adultsCount,
      customerIP,
      childrenCount,
      childAge1,
      childAge2,
      childAge3,
      currency,
      lang,
      waitForResult
    } = params
    if (!cityId && !hotelId && !iata) {
      errorParam(
        reject,
        '',
        400,
        'Param cityId or hotelId or iata is required'
      )
    }
    resolve({
      cityId: cityId || null,
      hotelId: hotelId || null,
      iata: iata || null,
      checkIn: checkIn || errorParam(reject, { checkIn }),
      checkOut: checkOut || errorParam(reject, { checkOut }),
      adultsCount: adultsCount || errorParam(reject, { adultsCount }),
      customerIP: customerIP || null,
      childrenCount: childrenCount || 0,
      childAge1: childAge1 || null,
      childAge2: childAge2 || null,
      childAge3: childAge3 || null,
      currency: currency || 'USD',
      lang: lang || null,
      marker: process.env.MARKER_TRAVELPAYOUTS,
      waitForResult: waitForResult || '0'
    })
  } catch (error) {
    reject(utils.buildErrObject(400, error.message))
  }
})

const createSignature = async (query) => new Promise((resolve) => {
  const organized = {}
  query.marker = null
  Object.keys(query)
    .sort()
    .forEach((key) => {
      organized[key] = query[key]
    })
  let signature = `${process.env.API_TOKEN_TRAVELPAYOUTS}:${process.env.MARKER_TRAVELPAYOUTS}`
  Object.values(organized).map((a) => {
    if (a) {
      signature = `${signature}:${a}`
    }
  })
  signature = signature.substr(0)
  resolve(md5(signature))
})

const secondRequest = (searchId, params) => {
  let {
    sortBy, sortAsc, limit, offset, roomsCount
  } = params
  sortBy = sortBy || null
  sortAsc = sortAsc || '0'
  limit = limit || 0
  offset = offset || 0
  roomsCount = roomsCount || 5
  let signature = `${process.env.API_TOKEN_TRAVELPAYOUTS}:${process.env.MARKER_TRAVELPAYOUTS}
                  :${limit}:${offset}:${roomsCount}:${searchId}:${sortAsc}:${sortBy}`
  signature = clearString(signature)
  signature = md5(signature)
  const root = 'http://engine.hotellook.com/api/v2/search/getResult.json?'
  const queryParams = `searchId=${searchId}
  &limit=${limit}
  &sortBy=${sortBy}
  &sortAsc=${sortAsc}
  &roomsCount=${roomsCount}
  &offset=${offset}
  &marker=${process.env.MARKER_TRAVELPAYOUTS}
  &signature=${signature}`
  const clearParams = clearString(queryParams)
  const url = `${root}${clearParams}`
  console.log('Second URL ==>', url)
  return url
}

const getPhotosHotel = (hotels) => new Promise(async (resolve, reject) => {
  try {
    // console.log(hotels);
    if (hotels && hotels.length) {
      const root = 'https://yasen.hotellook.com/photos/hotel_photos'
      const ids = [].concat(_.map(hotels, 'id'))
      const url = `${root}?id=${ids.join()}`
      const data = await utils.httpRequest(url, 'get')
      hotels = _.map(hotels, (a) => {
        a.photos = data[a.id]
        a.cover = `https://photo.hotellook.com/image_v2/limit/${_.head(
          data[a.id]
        )}/800/520.auto`
        return a
      })
      resolve(hotels)
    } else {
      resolve(hotels)
    }
  } catch (error) {
    console.log(error.message)
    reject(utils.buildErrObject(error.code, error.message))
  }
})
/********************
 * Public functions *
 ********************/

/**
 * DOCS HERE
 * Hotel search by name or location
 * https://support.travelpayouts.com/hc/en-us/articles/115000343268-Hotels-data-API#31
 */
exports.search_place = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = await checkParamsHotelsByNameOrLocation(params)
      const root = 'http://engine.hotellook.com/api/v2/lookup.json?'
      const queryParams = await destructuringParamsForUrl(query)
      const url = `${root}${queryParams}`
      const data = await utils.httpRequest(url, 'get')
      // const data_send = await renderizarData(data.results, query.limit)
      resolve(data.results.locations)
    } catch (error) {
      console.log(error.message)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })
}

/*
 * DOCS HERE
 * Displays the cost of living in hotels
 * https://support.travelpayouts.com/hc/en-us/articles/115000343268-Hotels-data-API#34
 */
exports.get_cost_in_hotels = async (params) => new Promise(async (resolve, reject) => {
  try {
    const query = await checkParamsCostOfLivinInHotels(params)
    const root = 'http://engine.hotellook.com/api/v2/cache.json?'
    const queryParams = await destructuringParamsForUrl(query)
    const url = `${root}${queryParams}`
    const data = await utils.httpRequest(url, 'get')
    resolve(data)
  } catch (error) {
    console.log(error.message)
    reject(utils.buildErrObject(error.code, error.message))
  }
})

/**
 * DOCS HERE
 * List of hotels in the archive
 * https://support.travelpayouts.com/hc/en-us/articles/115000343268-Hotels-data-API#35
 */
// exports.get_hotel_is_in_archive = async (params) => new Promise(async (resolve, reject) => {
//   try {
//     const query = await checkParamsHotelsInArchive(params)
//     const root = 'http://yasen.hotellook.com/tp/v1/hotels?'
//     const queryParams = await destructuringParamsForUrl(query)
//     const url = `${root}${queryParams}`
//     const data = await utils.httpRequest(url, 'get')
//     console.log(data)
//     resolve(data)
//   } catch (error) {
//     console.log(error)
//     reject(utils.buildErrObject(error.code, error.message))
//   }
// })

/**
 * DOCS HERE
 * Hotels Selections
 * https://support.travelpayouts.com/hc/en-us/articles/115000343268-Hotels-data-API#36
 */

exports.get_hotels_selections = async (params) => new Promise(async (resolve, reject) => {
  try {
    const query = await checkParamsHotelsSelections(params)
    const root = 'http://yasen.hotellook.com/tp/public/widget_location_dump.json?'
    const queryParams = await destructuringParamsForUrl(query)
    const url = `${root}${queryParams}`
    const data = await utils.httpRequest(url, 'get')
    resolve(data)
  } catch (error) {
    console.log(error.message)
    reject(utils.buildErrObject(error.code, error.message))
  }
})

/**
 * The types of hotel collections
 * Get all items function called by route
 * @param {Object} params - The request recovers the list of all available separate collections.
 * This type is used to search for hotels with a discount.
 * * id : string - {required} - id of the city
 */
exports.get_types_hotel_collections = async (params) => new Promise(async (resolve, reject) => {
  try {
    const query = await checkParamsTypesHotelCollections(params)
    const root = 'http://yasen.hotellook.com/tp/public/available_selections.json?'
    const queryParams = await destructuringParamsForUrl(query)
    const url = `${root}${queryParams}`
    const data = await utils.httpRequest(url, 'get')
    resolve(data)
  } catch (error) {
    console.log(error.message)
    reject(utils.buildErrObject(error.code, error.message))
  }
})

/***************************
 * Hotels statistical data *
 ***************************/

/**
 * DOCS HERE
 * Search architecture
 * https://support.travelpayouts.com/hc/en-us/articles/203956133-Hotel-search-API#5
 * Reformated method, old method is above
 * @param {*} params
 */
exports.get_search_management = (params) => new Promise(async (resolve, reject) => {
  try {
    // console.log(params)
    const query = await checkedSearchManagement(params)
    const root = 'http://engine.hotellook.com/api/v2/search/start.json?'
    const queryParams = await destructuringParamsForUrl(query)
    const signature = `&signature=${await createSignature(query)}`
    const url = `${root}${queryParams}${signature}`

    /**
       * finalHttp :
       *  Realizamos la llamda al primer metodo que nos devuelve el searchId
       *  En el pipe del primer metodo colocamos que luego de finalizar imediatamente
       * realize la siguiente peticion
       * secondRequest el cual pasamos el searchID y como esta peticion tarda,
       * para no saturar el server de la api de hoteles
       *  colocamos una delay 1 seg osea que si realiza la peticion y la api
       * devuelve error esperar 1 seg y lo vuelve intentar asi
       * sucesivamente retry(15) 15 veces
       */

    const finalHttp$ = utils.httpRequest$(url, 'get', {}, {}).pipe(
      tap(() => console.log('Iniciando esperando 7,5segundos')),
      switchMap((resultFirst) => utils
        .httpRequest$(secondRequest(resultFirst.searchId, params), 'get', {}, {})
        .pipe(
          tap(() => console.log(`Buscando #${resultFirst.searchId}`)),
          retryWhen((errors) => errors.pipe(
            delay(5000),
            tap((errorStatus) => {
              if (!['409'].includes(`${errorStatus.response.status}`)) {
                throw errorStatus
              } else {
                // delay(10000)
                console.log(
                  `Intentando nuevamente (10seg) ... #${resultFirst.searchId}`
                )
              }
            })
          ))
        ))
    )
    finalHttp$.subscribe(
      async (data) => {
        data.result = await getPhotosHotel(data.result)
        resolve(data)
      },
      () => {
        reject(utils.buildErrObject('422', 'ERROR_WITH_HOTEL_API'))
      }
    )
  } catch (error) {
    reject(utils.buildErrObject(error.code, error.message))
  }
})

/**
 *
 * @param {*} params
 */

exports.get_hotel_single = (params) => new Promise(async (resolve, reject) => {
  try {
    params = { ...params, ...{ limit: 1, waitForResult: 1 } }
    const query = await checkedSearchManagement(params)
    const root = 'http://engine.hotellook.com/api/v2/search/start.json?'
    const queryParams = await destructuringParamsForUrl(query)
    const signature = `&signature=${await createSignature(query)}`
    const url = `${root}${queryParams}${signature}`
    // const getData = utils.httpRequest$(url, 'get')
    const finalHttp$ = utils
      .httpRequest$(url, 'get')
      .pipe()
    finalHttp$.subscribe(
      async (data) => {
        // data.result = await getPhotosHotel(data.result)
        resolve(data)
      },
      () => {
        reject(utils.buildErrObject('422', 'ERROR_WITH_HOTEL_API'))
      }
    )
  } catch (error) {
    reject(utils.buildErrObject(error.code, error.message))
  }
})
/**
 * NEW Version fast !
 * https://travelpayouts.github.io/slate/#hotels-data-api
 */

exports.get_hotels_v2 = (params) => new Promise((resolve) => {
  try {
    const {
      // eslint-disable-next-line no-unused-vars
      src = 'madrid',
      lang = 'es',
      limit = 100,
      currency = 'usd',
      cityId = null
    } = params
    const url = [
      'http://yasen.hotellook.com/tp/public/widget_location_dump.json?',
      `currency=${currency}&language=${lang}&limit=${limit}&id=${cityId}&`,
      `type=popularity&token=${process.env.API_TOKEN_TRAVELPAYOUTS}`
    ].join('')
    const getData = utils.httpRequest$(url, 'get')
    getData.subscribe((res) => {
      const { popularity } = res
      _.forEach(popularity, (i) => {
        i.cover = `https://photo.hotellook.com/image_v2/limit/h${i.hotel_id}_1/800/520.auto`
        i.address = i.hotel_type.join(',')
        i.searchParams = params
        i.urlExternal = [
          'https://hoteles.mochileros.com.mx/hotels?',
          `hotelId=${i.hotel_id}`,
          `&checkIn=${params.checkIn}&checkOut=${params.checkOut}`,
          `&adults=${params.adultsCount}&language=${lang}&currency=${currency}`,
          `&cityId=${cityId}&marker=${process.env.MARKER_TRAVELPAYOUTS}`
        ].join('')
        i.price = i.last_price_info ? i.last_price_info.price_pn : 100
        return i
      })
      // popularity = _.sortBy(popularity, 'price')
      resolve({ result: popularity })
    }, (err) => {
      console.log('get_hotels_v2', err.message)
    })
  } catch (error) {
    console.log(error.message)
  }
})
