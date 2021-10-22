const { loggerSlack } = require('../../../config/logger')
/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
const handleError = (res = {}, err = {}) => {
  try {
    // Prints error in console
    if (process.env.NODE_ENV === 'development') {
      console.log(err)
    } else if (typeof err === 'object') {
      if (err.message) {
        loggerSlack.write(`\n ⚠️ MESSAGE ==> ${err.message}`)
      }
      if (err.stack) {
        loggerSlack.write(`\n ⛔️ STACKTRACE: ==> ${err.stack}`)
      }
    } else {
      loggerSlack.write(`\n ❌ ONLY_MESSAGE: ==> ${err.stack}`)
    }
    // Sends error to user
    res.status(err.code).json({
      errors: {
        msg: err.message
      }
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      errors: {
        msg: 'UNDEFINED_ERROR_SHOW_LOG_OAUTH',
        err
      }
    })
  }
}

module.exports = { handleError }
