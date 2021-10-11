# Plugin para hoteles travelpayouts

_Plugin para nodejs, para obtener hoteles y el link referencial de pago_

¡Atención! Si envía una solicitud sin un token, la cantidad de consultas será limitada. Los valores de las restricciones se pasan en el encabezado de respuesta:

## Busqueda de hotel por nombre

Los campos que se encian son los siguientes:

-   query - required - parámetro principal, se establece: como un texto opor longitud y latitud (también muestra los objetos más cercanos)
-   lang: idioma de visualización. Puede tomar cualquier código isolenguaje (pt, en, fr, de, id, it, pl, es, th, ru); si la base de datos no incluye una traducción para el idioma solicitado, devuelve el nombre en inglés del objeto. De forma predeterminada, lang = "en"
-   lookFor – {optional} - objects displayed in the results : city | hotel | both

Se consume de la siguiente manera: Buscamos el nombre de un hotel - Hotel Madrid Arganda

```javascript
exports.getByNameOrLocation = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = await checkParamsHotelsByNameOrLocation(params)
      // const size_page = 100;
      // const seccion = Math.trunc( ( (query.page - 1) * query.limit ) / size_page ) + 1 ;
      var url = `http://engine.hotellook.com/api/v2/lookup.json?query=${query.query}&lang=${query.lang}&limit=${query.limit}&token=${query.token}`
      url =
        url + `${query.convertCase ? `&convertCase=${query.convertCase}` : ''}`
      // console.log(url)
      var data = await utils.httpRequest(url, 'get')
      console.log(data)
      var data_send = await renderizarData(
        data.results,
        query.limit,
        query.page
      )
      // console.log(data_send)
      resolve(data_send)
    } catch (error) {
      console.log(error)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })
}
```

Regresa la información:

```json
"locations": [],
"hotels": [
    {
        "_score": 467381,
        "fullName": "B&B Hotel Madrid Arganda, Arganda del Rey, Spain",
        "label": "B&B Hotel Madrid Arganda",
        "locationName": "Arganda del Rey, Spain",
        "location": {
            "lat": 40.30989,
            "lon": -3.48122
        },
        "locationId": 3155,
        "id": "293201"
    }
]
```

Ahora consultamos el precio del hotel, esta funcion no consulta la disponibilidad, solo el precio.
Queremos obtener los precios de una semana

```javascript
params = { locationId: '3155', checkIn: '2021-04-01', checkOut: '2021-04-08' }
exports.getCostOfLivinInHotels = async (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const query = await checkParamsCostOfLivinInHotels(params)
      var url = `http://engine.hotellook.com/api/v2/cache.json?`
      for (const prop in query) {
        url = url + `${query[prop] ? `&${prop}=${query[prop]}` : ''}`
      }
      var data = await utils.httpRequest(url, 'get')
      console.log(data)
      // var data_send = await renderizarData( data.results, query.limit, query.page )
      // console.log(data_send)
      resolve(data)
    } catch (error) {
      console.log(error)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })
```

y regresa:

```json
[
  {
    "pricePercentile": {
      "3": 1141,
      "10": 1141,
      "35": 1141,
      "50": 1141,
      "75": 1141,
      "99": 1141
    },
    "priceFrom": 1141,
    "hotelName": "Hotel Puerta America",
    "stars": 5,
    "location": {
      "country": "Spain",
      "geo": {
        "lon": -3.704255,
        "lat": 40.416876
      },
      "state": null,
      "name": "Madrid"
    },
    "locationId": 3683,
    "hotelId": 7777,
    "priceAvg": 1141
  },
  {
    "pricePercentile": {
      "3": 1323,
      "10": 1323,
      "35": 1323,
      "50": 1323,
      "75": 1323,
      "99": 1323
    },
    "priceFrom": 1323,
    "hotelName": "Only YOU Hotel Atocha",
    "stars": 4,
    "location": {
      "country": "Spain",
      "geo": {
        "lon": -3.704255,
        "lat": 40.416876
      },
      "state": null,
      "name": "Madrid"
    },
    "locationId": 3683,
    "hotelId": 1126845278,
    "priceAvg": 1323
  },
  {
    "pricePercentile": {
      "3": 2793,
      "10": 2793,
      "35": 2793,
      "50": 2793,
      "75": 2793,
      "99": 2793
    },
    "priceFrom": 2793,
    "hotelName": "B&B Hotel Madrid Centro Puerta del Sol",
    "stars": 3,
    "location": {
      "country": "Spain",
      "geo": {
        "lon": -3.704255,
        "lat": 40.416876
      },
      "state": null,
      "name": "Madrid"
    },
    "locationId": 3683,
    "hotelId": 1539710301,
    "priceAvg": 2793
  },
  {
    "pricePercentile": {
      "3": 588,
      "10": 588,
      "35": 588,
      "50": 588,
      "75": 588,
      "99": 588
    },
    "priceFrom": 588,
    "hotelName": "Ibis Madrid Aeropuerto Barajas",
    "stars": 2,
    "location": {
      "country": "Spain",
      "geo": {
        "lon": -3.704255,
        "lat": 40.416876
      },
      "state": null,
      "name": "Madrid"
    },
    "locationId": 3393,
    "hotelId": 284923,
    "priceAvg": 588
  }
]
```

#### Selecciones de hoteles

La solicitud recupera la lista de hoteles específicos según el ID de una ubicación. Una colección se forma según el período especificado. Si no se especifica el plazo, se formará una colección de los hoteles encontrados durante los últimos tres días.

```javascript
params = {
  check_in: '2021-04-01',
  check_out: '2021-04-07',
  currency: 'usd',
  language: 'es',
  limit: '10',
  type: 'popularity',
  id: '3683'
}
exports.getHotelsSelections = async (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const query = await checkParamsHotelsSelections(params)
      var url = `http://yasen.hotellook.com/tp/public/widget_location_dump.json?`
      for (const prop in query) {
        url = url + `${query[prop] ? `&${prop}=${query[prop]}` : ''}`
      }
      var data = await utils.httpRequest(url, 'get')
      console.log(data)
      // var data_send = await renderizarData( data.results, query.limit, query.page )
      // console.log(data_send)
      resolve(data)
    } catch (error) {
      console.log(error)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })
```

#### Los tipos de colecciones hoteleras

La solicitud recupera la lista de todas las colecciones separadas disponibles. Este tipo se utiliza para buscar hoteles con descuento.

```javascript
exports.getHotelsSelections = async ( params ) => new Promise ( async ( resolve, reject )=>{
    var params = { id: } // El id pertenece a
    try {
        const query = await checkParamsHotelsSelections(params)
        var url = `http://yasen.hotellook.com/tp/public/widget_location_dump.json?`
        for ( const prop in query ){
            url = url + `${ ( query[prop] ) ? `&${prop}=${query[prop]}` : '' }`
        }
        var data = await utils.httpRequest(url,'get')
        console.log(data)
        // var data_send = await renderizarData( data.results, query.limit, query.page )
        // console.log(data_send)
        resolve( data )
    } catch (error) {
        console.log(error)
        reject( utils.buildErrObject( error.code , error.message) )
    }
})
```

#### Api Hotels

-   Cada consulta de búsqueda debe ser iniciada por el usuario y los resultados deben mostrarse al usuario en su totalidad. Los resultados de cada consulta deben contener un botón "comprar" junto a cada opción de vuelo.
-   La tasa de conversión de las búsquedas a través del enlace Comprar debe ser del 9% o más. La tasa de conversión del botón Comprar a compras reales debe ser de al menos 5%.

Busque por código IATA de hotel o cityId (ID de ubicación) o hotelId (ID de hotel). Se pueden especificar todas las opciones o solo una. Si especifica hotelId y cityId, solo se utilizará hotelId. Si especifica iata y cityId, se utilizará iata.

Al utilizar esta búsqueda, es posible acceder a sus resultados no inmediatamente, sino después de un período de tiempo que no exceda los 15 minutos. El manejo está en el ID de solicitud searchId.

Atención ! El número predeterminado de solicitudes está limitado a 200 solicitudes por hora para una dirección IP. Si necesita procesar más solicitudes, envíe una nota a [support@travelpayouts.com](mailto:support@travelpayouts.com).

Para poder consumir se debe de enviar los siguientes parametros:

-   cityId – the location ID (the query static/locations.json)
-   hotelId – the hotel ID (the query static/hotels.json)
-   iata – iata code of city

Nota . La solicitud debe tener al menos uno de los parámetros requeridos iata, cityId o hotelId.

-   checkIn – formato de fecha de check-in: aaaa – MM – dd
-   checkOut – formato de fecha de salida: aaaa – MM – dd
-   adultsCount – número de adultos
-   customerIP – IP del usuario que inició la solicitud
-   childrenCount – el número de hijos; valores posibles - de 0 a 3. Predeterminado - 0
-   childAge1, childAge2, childAge3 – Edades de los niños (si childrenCount es mayor que 0). La edad predeterminada es 1 año (máx. = 17)
-   lang – the language of the search result. Stated together with the region
    en_US
    en_GB
    ru_RU
    de_DE
    en_AU
    en_CA
    en_IE
    es_ES
    fr_FR
    it_IT
    pl_PL
    th_TH
-   currency – USD, RUB, EUR, ...
-   sortBy
-   -   popularity - by popularity
-   -   price - by price
-   -   name - by name
-   -   guestScore – by User Rating
-   -   stars – by number of stars Default – popularity
-   sortAsc – how to sort the values:
-   -   ascending
-   -   descending Default – 1.

Para consumir:

```javascript
exports.getSearchManagement = async (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const sortBy = params.sortBy
        ? params.sortBy
        : reject(utils.buildErrObject(400, 'Param sortBy is required'))
      const sortAsc = params.sortAsc ? params.sortAsc : '0'
      const query = await checkgetSearchManagement(params)
      var url = `http://engine.hotellook.com/api/v2/search/start.json?`
      for (const prop in query) {
        url = url + `${query[prop] ? `&${prop}=${query[prop]}` : ''}`
      }
      var signature = await createSignature(query)
      url = url + `&signature=${signature}`
      console.log(url)
      var data = await utils.httpRequest(url, 'get')
      console.log(data)
      if (data.status === 'ok')
        data = await secondRequest(data.searchId, sortBy, sortAsc)
      resolve(data)
    } catch (error) {
      console.log(error)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })
```

Automaticamente se obtiene el searchId y se genera la segunda consulta
