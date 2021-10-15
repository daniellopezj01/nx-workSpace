const helperPnrAgencyInfo = () =>
  new Promise((resolve) => {
    resolve({
      Address: {
        AddressLine: 'MOCHILEROS',
        CityName: 'CIUDAD DE MEXICO',
        CountryCode: 'MX',
        PostalCode: '76092',
        StreetNmbr: 'km 14 tranv 0a 41 23'
        // PostalCode: '76092',
        // StateCountyProv: {
        // StateCode: 'TX'
        // },
        // StreetNmbr: '3150 SABRE DRIVE'
      },
      Ticketing: {
        TicketType: '7TAW',
        PseudoCityCode: process.env.SABRE_PCC
      }
    })
  })

module.exports = { helperPnrAgencyInfo }
