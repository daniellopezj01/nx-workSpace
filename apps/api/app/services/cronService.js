const cron = require('node-cron')
const { serviceRefreshTokenLongLive } = require('../controllers/external/services')
const { getInfo, updateDepartures, disabledTours } = require('../plugins/contiki')
const { assignedChangeCurrency } = require('../plugins/sabre/assignedChangeCurrency')
const { authSabre } = require('../plugins/sabre/authSabre')
const { loggerSlack } = require('../../config/logger')
/**
 * Evere week
 */
const callCrons = () => {
  console.log('incializacion del cron')
  cron.schedule('0 0 0 * * *', async () => {
    try {
      console.log('refrescar token de sabre')
      loggerSlack.write('\n ✌✌ MESSAGE ==> BEGIN  token sabre')
      await authSabre()
      await assignedChangeCurrency()
      loggerSlack.write('\n ✔ MESSAGE ==> completed  token sabre')
    } catch (error) {
      console.log('cron', error.message)
    }
  })
  cron.schedule('0 0 0 * * *', async () => {
    try {
      console.log('se ha ejecuta el cron Refresh_Token_Instagram')
      // await instagram.refreshTokenLongLive()
      loggerSlack.write('\n ✌✌ MESSAGE ==> BEGIN CRON instagram')
      await serviceRefreshTokenLongLive()
      loggerSlack.write('\n ✔ MESSAGE ==> completed cron instagram')
    } catch (error) {
      console.log('cron', error.message)
    }
  })
  cron.schedule('0 0 0 1 * *', async () => { // scraper contiki
    try {
      loggerSlack.write('\n ✌✌ MESSAGE ==> BEGIN CRON TOURS CONTIKI')
      await getInfo()
      loggerSlack.write('\n ✔ MESSAGE ==> completed cron TOURS CONTIKI')
    } catch (error) {
      console.log('cron scraper contiki', error.message)
    }
  })
  cron.schedule('0 0 1 * * *', async () => { // scraper departures contiki
    try {
      loggerSlack.write('\n ✌✌ MESSAGE ==> BEGIN CRON DEPARTURES CONTIKI')
      await updateDepartures()
      loggerSlack.write('\n ✔ MESSAGE ==> completed cron DEPARTURES CONTIKI')
    } catch (error) {
      console.log('cron scraper contiki', error.message)
    }
  })
  cron.schedule('0 0 2 * * *', async () => { // scraper departures contiki
    try {
      loggerSlack.write('\n ✌✌ MESSAGE ==> BEGIN CRON DISABLED DEPARTURES CONTIKI')
      await disabledTours()
      loggerSlack.write('\n ✌✌ MESSAGE ==> COMPELTED CRON DISABLED DEPARTURES CONTIKI')
    } catch (error) {
      console.log('cron scraper contiki', error.message)
    }
  })
}

module.exports = { callCrons }
