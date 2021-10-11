# Plugin para vuelos travelpayouts

_Plugin para nodejs, para obtener vuelos y el link referencial de pago_

La api de travelpayout (fligths) esta dividida en 3 secciones:

-   Flight Data Access API v1
-   Flight Data Access API v2
-   Flights search API: Real-time and multi-city search

### Flight Data Access API v1

### Flights search API: Real-time and multi-city search

Con la ayuda de API, puede obtener los resultados de las solicitudes en tiempo real y crear una búsqueda de varias ciudades.

De forma predeterminada, un socio no puede enviar más de 200 consultas por hora para una IP, utilizando la API de búsqueda de boletos de avión. Esta restricción puede modificarse si la situación así lo requiere.

El plugin se consume con la siguiente funcion:

```javascript
exports.getFlights = async (params) =>
  new Promise(async (resolve, reject) => {
    try {
      var query = await checkParamsFlights(params)
      query.signature = await createMd5Signature(query)
      var url = 'https://api.travelpayouts.com/v1/flight_search'
      var data = await utils.httpRequest(url, 'post', {}, query)
      resolve(data)
    } catch (error) {
      console.log(error)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })
```

La funcion debe de recibir como parametros un objeto con la siguiente estructura:
Buscamos un vuelo redondo de Madrid a Barcelona para el día 10 de Mayo del 2021

```json
{
  "host": "beta.aviasales.ru",
  "currency": "USD", // Moneda en que regresara el precio del ticket
  "user_ip": "127.0.0.1", // La ip del cliente que realiza la petición
  "locale": "en", // El lenguaje con el que se mostrara la busqueda
  "trip_class": "Y", // Clase de vuelo Y - Economy, C - Bussiness
  "passengers": {
    // Objeco con la información de los psageros
    "adults": 1,
    "children": 0,
    "infants": 0
  },
  "segments": [
    //Objeto con la información del origen
    {
      "origin": "MAD", // Origen del vuelo
      "destination": "BCN", // Destino
      "date": "2018-05-30" // Fecha de partida
    }, // Si se envia solo un segmento el vuelo es de tipo: One way
    {
      "origin": "BCN",
      "destination": "MAD",
      "date": "2018-06-12"
    } // Si se envia dos segmentos el vuelo de de tipo: Roundtrip y se se llegara a enviar hasta 3 segmentos
  ]
}
```

Se consume la función de la siguiente manera:

```javascript
exports.getFligthRealTime = async (req, res) => {
  try {
    var data = req.body
    res.status(200).json(await travelpayouts_fligths.getFlights(data))
  } catch (error) {
    utils.handleError(res, error)
  }
}
```

La respuesta regresa de la siguiente manera:

```json
{
  "chain_name": "jetradar_rt_search_native_format",
  "locale": "en",
  "user_env": {},
  "meta": {
    "uuid": "d9266de5-7578-418f-9ddc-6b176ae45923"
  },
  "host": "beta.aviasales.ru",
  "segments": [
    {
      "origin": "CPH",
      "original_origin": "CPH",
      "origin_country": "DK",
      "destination": "ROM",
      "date": "2018-06-24",
      "destination_country": "IT",
      "original_destination": "ROM"
    },
    {
      "origin": "ROM",
      "original_origin": "ROM",
      "origin_country": "IT",
      "destination": "CPH",
      "date": "2018-06-25",
      "destination_country": "DK",
      "original_destination": "CPH"
    }
  ],
  "affiliate_has_sales": true,
  "show_ads": true,
  "destination_country": "IT",
  "passengers": {
    "children": 0,
    "adults": 1,
    "infants": 0
  },
  "currency_rates": {
    "lak": 0.0075,
    "czk": 2.95961
  },
  "travelpayouts_api_request": true,
  "auid": null,
  "server_name": "zoo39.int.avs.io.yasen.bee.13",
  "know_english": "false",
  "currency": "usd",
  "range": "false",
  "geoip_city": "Unknown",
  "metropoly_airports": {
    "CPH": ["CPH", "CPH", "ZGH", "RKE"],
    "ROM": ["ROM", "IRR", "FCO", "ROM", "XRJ", "IRT", "CIA"]
  },
  "search_depth": 60,
  "signature": "fb7ded0ddd86270a262d832322f46093",
  "trip_class": "Y",
  "affiliate": true,
  "initiated_at": "2018-04-26 05:09:42.031853",
  "user_id": null,
  "start_search_timestamp": 1524719382.03045,
  "gates_count": 0,
  "market": "dk",
  "user_ip": null,
  "internal": false,
  "_ga": null,
  "clean_marker": "xxxxx",
  "open_jaw": false,
  "origin_country": "DK",
  "marker": "xxxxx",
  "search_id": "d9266de5-7578-418f-9ddc-6b176ae45923",
  "geoip_country": "Unknown"
}
```

Dentro de esta información vamos a obtener todos los vuelos en las diferentes horas y tambien con cuantas paradas cuenta cada uno, la filtracion por campos se hace en este apartado

Si la consulta tiene un search_id se obtiene la información del vuelo completa, dentro de la siguiente busqueda, se puede filtrar por número
de paradas, precio, etc.. la filtracion se debe de hacer de manera manual, ya que la api devulve toda la información.

Se consume de la siguiente manera:

```javascript
exports.getAllInfoFlight = async (search_id) =>
  new Promise(async (resolve, reject) => {
    try {
      search_id
        ? null
        : reject(utils.buildErrObject(400, 'search_id is required'))
      var url = `https://api.travelpayouts.com/v1/flight_search_results?uuid=${search_id}`
      console.log(url)
      var data = await utils.httpRequest(url, 'get')
      resolve(data)
    } catch (error) {
      console.log(error)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })
```

Para mas información de como regresa la informacion ingresar a:

<https://travelpayouts.github.io/slate/#getting-search-results>

No se aplica una paginación ya que la consulta por el search_id caduca cada 15 minutos y la paginación no serviria.

#### How to get a link to the agency website

Al obtener toda la información detallada de los vuelos nos vamos a centrar en la siguiente seccion:

```json
"terms": {
  "20": {
      "currency": "rub",
      "price": 27471,
      "unified_price": 27471,
      "url": 2000011, // Este es el term.url que vamos a consumir en la siguiente funcion para obtener el pago
      "multiplier": 0.000001,
      "flight_additional_tariff_infos": [
          [
              null
          ],
          [
              null
          ]
      ],
      "flights_baggage": [
          [
              false
          ],
          [
              false
          ]
      ],
      "flights_handbags": [
          [
              "1PC10"
          ],
          [
              "1PC10"
          ]
      ],
      "baggage_source": [
          [
              0
          ],
          [
              0
          ]
      ],
      "handbags_source": [
          [
              0
          ],
          [
              0
          ]
      ]
  }
},
```

con terms.url y el uuid los enviamos en un objeto y consumis la funcion asi:

```javascript
exports.getPayReferencial = async (params) =>
  new Promise(async (resolve, reject) => {
    try {
      params.search_id
        ? null
        : reject(utils.buildErrObject(400, 'search_id is required'))(
            params.term_url
          )
        ? null
        : reject(utils.buildErrObject(400, 'term_url is required'))
      var url = `https://api.travelpayouts.com/v1/flight_searches/${params.search_id}/clicks/${params.term_url}`
      console.log(url)
      var data = await utils.httpRequest(url, 'get')
      resolve(data)
    } catch (error) {
      console.log(error)
      reject(utils.buildErrObject(error.code, error.message))
    }
  })
```

Nota: La “vida útil” de dichos enlaces es de 15 minutos, después de los cuales deberá buscar nuevamente los precios actuales y generar una nueva referencia a la transición.

Obtenemos una respuesta de la siguiente forma:

```json
{
  "params": {},
  "method": "GET",
  "url": "https://www.svyaznoy.travel/?utm_source=as.ru&utm_medium=cpa&utm_campaign=meta_avia#MOW0906/BKK1506/A1/C0/I0/S0/22316/EK-132;EK-374/EK-373;EK-131&marker=7uh46i0v2",
  "gate_id": 62,
  "click_id": 22135952358110
}
```
