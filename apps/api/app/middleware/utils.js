const { Observable } = require('rxjs')
const redis = require('redis')
const mongoose = require('mongoose')
const requestIp = require('request-ip')
const { validationResult } = require('express-validator')
const { AxiosRedis } = require('@tictactrip/axios-redis')
const fs = require('fs')
const fsPromises = require('fs').promises
const axios = require('axios').default
const { loggerSlack } = require('../../config/logger')

let axiosRedis
let redisClient

if (process.env.USE_REDIS === 'true') {
  redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  })

  axiosRedis = new AxiosRedis(redisClient, {
    expirationInMS: 3600000 * 1,
    separator: '___',
    prefix: 'mochileros_plugins',
    axiosConfigPaths: ['method', 'url', 'params', 'data']
  })
}

const axiosInstance = axios.create(
  process.env.USE_REDIS === 'true'
    ? {
      adapter: (config) => AxiosRedis.ADAPTER(config, axiosRedis)
    }
    : {}
)

const generateBasicAuth = () => {
  const appIdOauth = process.env.OAUHT_APP_ID || null
  const appSecretOauth = process.env.OAUHT_APP_SECRET || null
  return Buffer.from(`${appIdOauth}:${appSecretOauth}`, 'utf8').toString(
    'base64'
  )
}
/**
 * Removes extension from file
 * @param {string} file - filename
 */
exports.removeExtensionFromFile = (file) => {
  return file.split('.').slice(0, -1).join('.').toString()
}

/**
 * Gets IP from user
 * @param {*} req - request object
 */
exports.getIP = (req) => requestIp.getClientIp(req)

/**
 * Gets browser info from user
 * @param {*} req - request object
 */
exports.getBrowserInfo = (req) => req.headers['user-agent']

/**
 * Gets country from user using CloudFlare header 'cf-ipcountry'
 * @param {*} req - request object
 */
exports.getCountry = (req) => req.headers['cf-ipcountry'] ? req.headers['cf-ipcountry'] : 'XX'

/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
exports.handleError = (res, err) => {
  try {
    // Prints error in console
    if (process.env.NODE_ENV === 'development') {
      console.log(err.message)
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
    res.status(500).json({
      errors: {
        msg: 'UNDEFINED_ERROR_SHOW_LOG',
        err
      }
    })
  }
}

exports.handleErrorHooks = (res, err) => {
  // Prints error in console
  const { errors } = err.response.data || { error: null }
  if (process.env.NODE_ENV === 'development') {
    console.log(errors || 'error handleErrorHooks')
  }
  res.status(err.code || 422).json({
    errors: {
      msg: errors || 'ERROR_OAUTH_SERVICE_CONNECT_A'
    }
  })
}

exports.deleteFile = (routerFileDelete) => new Promise((resolve, reject) => {
  fs.unlink(`${routerFileDelete}`, (err) => {
    if (err) {
      reject(err)
    }
  })
  resolve('OK')
})

/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
exports.buildErrObject = (code, message) => {
  return {
    code,
    message
  }
}

/**
 * Builds error object
 * @param {string} error - error from original request
 * @param {number} reject - reject for return promise error
 * @param {number} code - error code
 * @param {string} message - error text
 */
exports.buildErrObjectReject = (error, reject, code, message) => {
  console.log(error.message)
  reject(this.buildErrObject(code, message))
}

/**
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next object
 */
exports.validationResult = (req, res, next) => {
  try {
    validationResult(req).throw()
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase()
    }
    return next()
  } catch (err) {
    return this.handleError(res, this.buildErrObject(422, err.array()))
  }
}

/**
 * Builds success object
 * @param {string} message - success text
 */
exports.buildSuccObject = (message) => {
  return {
    msg: message
  }
}

/**
 * Copy and paste file
 */

exports.copyAndPaste = (copyPath, pastePath) => fsPromises.copyFile(copyPath, pastePath)

/**
 * Checks if given ID is good for MongoDB
 * @param {string} id - id to check
 */
exports.isIDGood = async (id) => {
  return new Promise((resolve, reject) => {
    const goodID = mongoose.Types.ObjectId.isValid(id)
    return goodID
      ? resolve(id)
      : reject(this.buildErrObject(422, 'ID_MALFORMED'))
  })
}

/**
 * Checks if given ID or SLUG is good for MongoDB
 * @param {string} id - id to check
 */
exports.isIDGoodSlug = async (id) => {
  return new Promise((resolve) => {
    const goodID = mongoose.Types.ObjectId.isValid(id)
    return goodID ? resolve({ type: 'id', id }) : resolve({ type: 'slug', id })
  })
}

/**
 * Item not found
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Object} reject - reject object
 * @param {string} message - message
 */
exports.itemNotFound = (err, item, reject, message) => {
  if (err) {
    reject(this.buildErrObject(422, err.message))
  }
  if (!item) {
    reject(this.buildErrObject(404, message))
  }
}

// /**
//  * Item not found
//  * @param {string} length - limit characters
//  */
// exports.textRandom = (length) => {
//   let result = ''
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
//   const charactersLength = characters.length
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength))
//   }
//   return result
// }
/**
 * Item already exists
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Object} reject - reject object
 * @param {string} message - message
 */
exports.itemAlreadyExists = (err, item, reject, message) => {
  if (err) {
    reject(this.buildErrObject(422, err.message))
  }
  if (item) {
    reject(this.buildErrObject(422, message))
  }
}

exports.generateTokenBase64 = async (Username, Password) => new Promise((resolve) => {
  const auth = `Basic ${Buffer.from(`${Username}:${Password}`).toString('base64')}`
  resolve({ Authorization: auth })
})

exports.structureToken = async (token) => new Promise((resolve) => {
  const auth = `Basic ${token}`
  resolve({ Authorization: auth })
})

exports.structureTokenBearer = async (token) => new Promise((resolve) => {
  const auth = `Bearer ${token}`
  resolve({ Authorization: auth })
})

/**
 * Structure for request
 * @param {*} url
 * @param {*} method
 * @param {*} headers
 * @param {*} body
 */

exports.structureRequest = async () => new Promise((resolve) => {
  const url = process.env.OAUHT_URL || null
  const baseToken = generateBasicAuth()
  const header = {
    'Axios-Redis-Cache-Duration': null,
    Authorization: `Basic ${baseToken}`
  }
  resolve({
    header,
    url
  })
})

/**
 * Item already exists
 * @param {string} url - string endpoint
 * @param {string} method - GET | POST | PATCH | DELETE
 * @param {Object} headers - headers
 * @param {Object} body - Object
 */
exports.httpRequest = async (url, method, headers = null, body) => {
  return new Promise(async (resolve, reject) => {
    await axios({
      method,
      url: encodeURI(url),
      headers,
      data: body
    })
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        console.log(err.response.data)
        err.message = err.response.data
        reject(this.buildErrObject(err.response.status, err.message))
      })
  })
}

/**
 * HTTP Request with Observable
 */

exports.httpRequest$ = (url, method, headers, data = null) => new Observable((observer) => {
  const request = {
    method,
    url,
    headers
  }
  if (data) {
    request.data = data
  }
  axiosInstance(request)
    .then((response) => {
      observer.next(response.data)
      observer.complete()
    })
    .catch((error) => {
      observer.error(error)
    })
})
