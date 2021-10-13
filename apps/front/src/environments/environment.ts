// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: `http://localhost:8000/api/1.0`,
  serverSocket: 'http://localhost:8000',
  // api: `http://localhost:3000/api`,
  daysTokenExpire: 4,
  webPage: 'http://localhost:4200',
  serverOauth: 'http://localhost:3002',
  tenant: 'b98b1dea-b3f4-4b72-bcdf-9d36607e2603',
  currenciesExpire: 1,
  title: ` | ✈ Tours al mundo y europa para jóvenes | Mochileros.com.mx`,
  mapBoxApi:
    'pk.eyJ1IjoiZGFuaWVsbG9wZXpqMDEiLCJhIjoiY2s4bG90ZWxhMGYzajNocHpycjM1MzRiZyJ9.O07j_ad0CuFDeI5VeKsLhA',
  stripe_pk: 'pk_test_Wj915HLpr6PpdvzQMuzq8idv',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
