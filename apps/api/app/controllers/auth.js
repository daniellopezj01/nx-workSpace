/* eslint-disable handle-callback-err */
/* eslint-disable no-underscore-dangle */
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const { addHours } = require('date-fns')
const { matchedData } = require('express-validator')
const ReferredUser = require('../models/referredUsers')
const User = require('../models/user')
const SettingsReferred = require('../models/settingReferred')
const Settings = require('../models/settings')
const UserAccess = require('../models/userAccess')
const db = require('../middleware/db')
const utils = require('../middleware/utils')
const auth = require('../middleware/auth')
// const emailer = require('../middleware/emailer')
const referredService = require('../services/managerReferred')
const facebookProvider = require('../services/oauth.facebook')
const googleProvider = require('../services/oauth.google')

const HOURS_TO_BLOCK = 2
const LOGIN_ATTEMPTS = 5

/*********************
 * Private functions *
 *********************/
const generateBasicAuth = () => {
  const appIdOauth = process.env.OAUHT_APP_ID || null
  const appSecretOauth = process.env.OAUHT_APP_SECRET || null
  return Buffer.from(`${appIdOauth}:${appSecretOauth}`, 'utf8').toString(
    'base64'
  )
}

/**
 * Find Referred Plan default
 */

const findReferredPlan = async () =>
  new Promise((resolve) => {
    const plan = SettingsReferred.findOne({ default: true })
    resolve(plan)
  })

const generateToken = (user) => {
  // Gets expiration time
  const expiration =
    Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRATION_IN_MINUTES

  // returns signed and encrypted token
  return auth.encrypt(
    jwt.sign(
      {
        data: {
          _id: user
        },
        exp: expiration
      },
      process.env.JWT_SECRET
    )
  )
}

/** Save Avatar */

const findUserByRefCode = (referredCode) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        referredCode
      },
      (err, item) => {
        utils.itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST')
        resolve(item)
      }
    )
  })
}

const registerUserReferred = async (codeRef, userTo) => {
  console.log(' ****** ------------->', codeRef)
  const referredUser = await findUserByRefCode(codeRef)
  console.log('referredUser ------> ', referredUser)
  if (referredUser.typeReferred) {
    const planReferred = await db.findOne(
      { _id: referredUser.typeReferred },
      SettingsReferred
    )
    console.log('PLAN- ---->', planReferred)
    const body = {
      userTo: userTo._id,
      userFrom: planReferred._id,
      amountFrom: planReferred.amountFrom,
      amountTo: planReferred.amountTo,
      planReferred
    }
    await db.createItem(body, ReferredUser)
  }
}

/**
 * Creates an object with user info
 * @param {Object} req - request object
 */
const setUserInfo = (req) => {
  let user = {
    _id: req._id,
    name: req.name,
    email: req.email,
    role: req.role,
    avatar: req.avatar,
    video: req.video,
    surname: req.surname,
    verified: req.verified,
    referredCode: req.referredCode,
    referred: req.ref || {},
    typeReferred: req.typeReferred
  }
  // Adds verification for testing purposes
  if (process.env.NODE_ENV !== 'production') {
    user = {
      ...user,
      verification: req.verification
    }
  }
  return user
}

const findByEmailTenant = async (emails, data) => {
  const userFind = await User.findOne({ email: _.head(emails) })
  if (userFind && userFind.avatar && userFind.avatar.includes('medium_')) {
    delete data.avatar
  }
  return new Promise((resolve) => {
    User.findOneAndUpdate(
      {
        email: { $in: emails }
      },
      data,
      {
        new: true
      },
      (err, item) => {
        resolve(item)
      }
    )
  })
}

/**
 * Saves a new user access and then returns token
 * @param {Object} req - request object
 * @param {Object} user - user object
 */
const saveUserAccessAndReturnToken = async (req, user) => {
  return new Promise((resolve, reject) => {
    const userAccess = new UserAccess({
      email: user.email,
      ip: utils.getIP(req),
      browser: utils.getBrowserInfo(req),
      country: utils.getCountry(req)
    })
    userAccess.save((err) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      const userInfo = setUserInfo(user)
      // Returns data with access token
      resolve({
        token: generateToken(user._id),
        user: userInfo
      })
    })
  })
}

/**
 * Blocks a user by setting blockExpires to the specified date based on constant HOURS_TO_BLOCK
 * @param {Object} user - user object
 */
const blockUser = async (user) => {
  return new Promise((resolve, reject) => {
    user.blockExpires = addHours(new Date(), HOURS_TO_BLOCK)
    user.save((err, result) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      if (result) {
        resolve(utils.buildErrObject(409, 'BLOCKED_USER'))
      }
    })
  })
}

/**
 * Builds the registration token
 * @param {Object} item - user object that contains created id
 * @param {Object} userInfo - user object
 */
const returnRegisterToken = (item, userInfo) => {
  if (process.env.NODE_ENV !== 'production') {
    userInfo.verification = item.verification
  }
  const data = {
    token: generateToken(item._id),
    user: userInfo
  }
  return data
}

/**
 * Saves login attempts to dabatabse
 * @param {Object} user - user object
 */
const saveLoginAttemptsToDB = async (user) => {
  return new Promise((resolve, reject) => {
    user.save((err, result) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      if (result) {
        resolve(true)
      }
    })
  })
}
/**
 * Finds user by email
 * @param {string} email - user´s email
 */
const findUser = async (email) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email
      },
      'password loginAttempts blockExpires name email role verified verification video avatar surname referredCode',
      (err, item) => {
        utils.itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST')
        resolve(item)
      }
    )
  })
}

/**
 * Finds user by ID
 * @param {string} id - user´s id
 */
const findUserById = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, item) => {
      utils.itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST')
      resolve(item)
    })
  })
}

/**
 * Adds one attempt to loginAttempts, then compares loginAttempts with the constant LOGIN_ATTEMPTS,
 * if is less returns wrong password, else returns blockUser function
 * @param {Object} user - user object
 */
const passwordsDoNotMatch = async (user) => {
  user.loginAttempts += 1
  await saveLoginAttemptsToDB(user)
  return new Promise((resolve, reject) => {
    if (user.loginAttempts <= LOGIN_ATTEMPTS) {
      resolve(utils.buildErrObject(409, 'WRONG_PASSWORD'))
    } else {
      resolve(blockUser(user))
    }
    reject(utils.buildErrObject(422, 'ERROR'))
  })
}

/**
 * Registers a new user in database
 * @param {Object} req - request object
 */
const registerUser = async (req) => {
  return new Promise((resolve, reject) => {
    const user = new User({
      name: req.name,
      surname: req.surname,
      email: req.email,
      password: req.password,
      verification: uuid.v4(),
      typeReferred: req.typeReferred,
      accessToken: req.accessToken
    })
    user.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      registerUserReferred(req.userReferred, item)
      resolve(item)
    })
  })
}

/**
 * Check if user exist in self database
 */

const findUserOrRegister = async (req) => {
  const userFind = await User.findOne({ email: req.email })
  if (!userFind) {
    const plan = (await findReferredPlan()) || null
    req.typeReferred = plan !== null ? plan._id : null
    const item = await registerUser(req)
    const userInfo = setUserInfo(item)
    return returnRegisterToken(item, userInfo)
  }
  userFind.set('accessToken', req.accessToken)
  userFind.save()
  return {
    token: generateToken(userFind._id),
    user: userFind
  }
}

/**
 * Checks if verification id exists for user
 * @param {string} id - verification id
 */
const verificationExists = async (id) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        verification: id,
        verified: false
      },
      (err, user) => {
        utils.itemNotFound(err, user, reject, 'NOT_FOUND_OR_ALREADY_VERIFIED')
        resolve(user)
      }
    )
  })
}

/**
 * Verifies an user
 * @param {Object} user - user object
 */
const verifyUser = async (user) => {
  return new Promise((resolve, reject) => {
    user.verified = true
    user.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      resolve({
        email: item.email,
        verified: item.verified
      })
    })
  })
}

/**
 * Updates a user password in database
 * @param {string} password - new password
 * @param {Object} user - user object
 */
const updatePassword = async (password, user) => {
  return new Promise((resolve, reject) => {
    user.password = password
    user.save((err, item) => {
      utils.itemNotFound(err, item, reject, 'NOT_FOUND')
      resolve(item)
    })
  })
}

/**
 * Finds user by email to reset password
 * @param {string} email - user email
 */
const checkIfExistMail = async (email) => {
  return new Promise((resolve) => {
    User.findOne(
      {
        email
      },
      (err, user) => {
        resolve(!!user)
      }
    )
  })
}

/**
 * Checks against user if has quested role
 * @param {Object} data - data object
 * @param {*} next - next callback
 */
const checkPermissions = async (data, next) => {
  return new Promise((resolve, reject) => {
    User.findById(data.id, (err, result) => {
      utils.itemNotFound(err, result, reject, 'NOT_FOUND')
      if (data.roles.indexOf(result.role) > -1) {
        return resolve(next())
      }
      return reject(utils.buildErrObject(401, 'UNAUTHORIZED'))
    })
  })
}

/**
 * Gets user id from token
 * @param {string} token - Encrypted and encoded token
 */
const getUserIdFromToken = async (token) => {
  return new Promise((resolve, reject) => {
    // Decrypts, verifies and decode token
    jwt.verify(auth.decrypt(token), process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(utils.buildErrObject(409, 'BAD_TOKEN'))
      }
      resolve(decoded.data._id)
    })
  })
}

/********************
 * Public functions *
 ********************/
/********************
 * Public functions *
 ********************/
// exports.getUserFromToken = async (token) => {
//   return new Promise((resolve, reject) => {
//     jwt.verify(
//       auth.decrypt(token),
//       process.env.JWT_SECRET,
//       async (err, decoded) => {
//         if (err) {
//           reject(utils.buildErrObject(409, 'BAD_TOKEN'))
//         }
//         const user = await findUserById(decoded.data._id)
//         resolve(user)
//       }
//     )
//   })
// }

// exports.getIdFromToken = async (token) => {
//   return new Promise((resolve, reject) => {
//     jwt.verify(
//       auth.decrypt(token),
//       process.env.JWT_SECRET,
//       async (err, decoded) => {
//         if (err) {
//           reject(utils.buildErrObject(409, 'BAD_TOKEN'))
//         }
//         const user = await findUserById(decoded.data._id)
//         resolve(user._id)
//       }
//     )
//   })
// }
/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
// exports.login = async (req, res) => {
//   try {
//     const data = matchedData(req)
//     const user = await findUser(data.email)
//     await userIsBlocked(user)
//     await checkLoginAttemptsAndBlockExpires(user)
//     const isPasswordMatch = await auth.checkPassword(data.password, user)
//     if (!isPasswordMatch) {
//       utils.handleError(res, await passwordsDoNotMatch(user))
//     } else {
//       // all ok, register access and return token
//       user.loginAttempts = 0
//       await saveLoginAttemptsToDB(user)
//       res.status(200).json(await saveUserAccessAndReturnToken(req, user))
//     }
//   } catch (error) {
//     utils.handleError(res, error)
//   }
// }

exports.generateBasicAuthGlobal = () => {
  const appIdOauth = process.env.OAUHT_APP_ID || null
  const appSecretOauth = process.env.OAUHT_APP_SECRET || null
  return Buffer.from(`${appIdOauth}:${appSecretOauth}`, 'utf8').toString(
    'base64'
  )
}

exports.login = async (req, res) => {
  try {
    const data = matchedData(req)
    const urlOauth = process.env.OAUHT_URL || null
    const baseToken = generateBasicAuth()
    const header = {
      'Axios-Redis-Cache-Duration': null,
      Authorization: `Basic ${baseToken}`
    }
    utils.httpRequest$(`${urlOauth}/login`, 'post', header, data).subscribe(
      (response) => {
        console.log(response)
        res.status(200).json(response)
      },
      (err) => {
        utils.handleErrorHooks(res, err)
      }
    )
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.register = async (req, res) => {
  try {
    const data = matchedData(req)
    const urlOauth = process.env.OAUHT_URL || null
    const baseToken = generateBasicAuth()
    const header = {
      'Axios-Redis-Cache-Duration': null,
      Authorization: `Basic ${baseToken}`
    }
    utils.httpRequest$(`${urlOauth}/register`, 'post', header, data).subscribe(
      async (response) => {
        console.log(response)
        res.status(200).json(response)
      },
      (err) => {
        utils.handleErrorHooks(res, err)
      }
    )
  } catch (error) {
    utils.handleError(res, error)
  }
}

// exports.register = async (req, res) => {
//   try {
//     // Gets locale from header 'Accept-Language'
//     const locale = req.getLocale()
//     req = matchedData(req)
//     const doesEmailExists = await emailer.emailExists(req.email)
//     if (!doesEmailExists) {
//       const plan = await findReferredPlan() || null
//       req.typeReferred = plan._id || null
//       const item = await registerUser(req)
//       const userInfo = setUserInfo(item)
//       const response = returnRegisterToken(item, userInfo)
//       if (req.avatar) {
//         const pathName = `./public/media/tmp_${nanoid.nanoid()}_image.png`
//         download(`${req.avatar}`, pathName, item)
//       }

//       emailer.sendRegistrationEmailMessage(locale, item)
//       res.status(201).json(response)
//     }
//   } catch (error) {
//     utils.handleError(res, error)
//   }
// }

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.verify = async (req, res) => {
  try {
    req = matchedData(req)
    const user = await verificationExists(req.id)
    res.status(200).json(await verifyUser(user))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Forgot password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.forgotPassword = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const data = matchedData(req)
    const urlOauth = process.env.OAUHT_URL || null
    const baseToken = generateBasicAuth()
    const header = {
      'Axios-Redis-Cache-Duration': null,
      Authorization: `Basic ${baseToken}`
    }
    utils.httpRequest$(`${urlOauth}/forgot`, 'post', header, data).subscribe(
      async (response) => {
        console.log(response)
        res.status(200).json(response)
      },
      (err) => {
        utils.handleErrorHooks(res, err)
      }
    )
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Reset password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.resetPassword = async (req, res) => {
  try {
    const data = matchedData(req)
    const urlOauth = process.env.OAUHT_URL || null
    const baseToken = generateBasicAuth()
    const header = {
      'Axios-Redis-Cache-Duration': null,
      Authorization: `Basic ${baseToken}`
    }
    utils.httpRequest$(`${urlOauth}/reset`, 'post', header, data).subscribe(
      async (response) => {
        console.log(response)
        res.status(200).json(response)
      },
      (err) => {
        utils.handleErrorHooks(res, err)
      }
    )
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Reset password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.resetPasswordAdmin = async (req, res) => {
  try {
    const data = matchedData(req)
    const id = await utils.isIDGood(data.id)
    const user = await db.getItem(id, User)
    const result = await updatePassword(data.password, user)
    res.status(200).json(result)
  } catch (error) {
    utils.handleError(res, error)
  }
}
/**
 * Reset password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.changePassword = async (req, res) => {
  try {
    const tokenEncrypted = req.headers.authorization
      .replace('Bearer ', '')
      .trim()
    const userId = await getUserIdFromToken(tokenEncrypted)
    const withOutPass = await findUserById(userId)
    const user = await findUser(withOutPass.email)
    const data = matchedData(req)
    const isPasswordMatch = await auth.checkPassword(data.old, user)
    if (!isPasswordMatch) {
      utils.handleError(res, await passwordsDoNotMatch(user))
    } else {
      await updatePassword(data.newpass, user)
      res.status(200).json({ msg: 'CHANGED_PASSWORD' })
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Refresh token function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.searchEmail = async (req, res) => {
  try {
    const data = matchedData(req)
    const user = await checkIfExistMail(data.email)
    res.status(200).json(user)
  } catch (error) {
    utils.handleError(res, error)
  }
}
// eslint-disable-next-line no-return-await
exports.getUserIdFromTokenExt = async (token) => await getUserIdFromToken(token)
/**
 * Refresh token function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getRefreshToken = async (req, res) => {
  try {
    const tokenEncrypted = req.headers.authorization
      .replace('Bearer ', '')
      .trim()
    let userId = await getUserIdFromToken(tokenEncrypted)
    userId = await utils.isIDGood(userId)
    const user = await findUserById(userId)
    await referredService.getDetailByUser(userId)
    // user = Object.assign(user,{ref})
    const token = await saveUserAccessAndReturnToken(req, user)
    // Removes user info from response
    // delete token.user
    token.settings = await db.findCheckSingle(Settings)
    res.status(200).json(token)
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Exchange Token with OAUTH
 * @param {*} req
 * @param {*} res
 */
exports.exchangeToken = async (req, res) => {
  try {
    const data = matchedData(req)
    const { accessToken, userReferred } = data
    const urlOauth = process.env.OAUHT_URL || null
    const baseToken = generateBasicAuth()
    const header = {
      'Axios-Redis-Cache-Duration': null,
      Authorization: `Basic ${baseToken}`
    }
    const response$ = await utils
      .httpRequest$(`${urlOauth}/exchange`, 'post', header, { accessToken })
      .toPromise()
    let { user } = response$
    user = { ...user, ...{ accessToken } }
    if (userReferred) {
      console.log('****************************', user)
      await registerUserReferred(userReferred, user) // <------------
    }
    res.status(200).json(await findUserOrRegister(user))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Roles authorization function called by route
 * @param {Array} roles - roles specified on the route
 */
exports.roleAuthorization = (roles) => async (req, res, next) => {
  try {
    const data = {
      id: req.user._id,
      roles
    }
    await checkPermissions(data, next)
  } catch (error) {
    utils.handleError(res, error)
  }
}

exports.loginFb = (req, res, next) => {
  // const data = matchedData(req)
  return facebookProvider(req).authenticate('facebook', {
    scope: ['public_profile', 'email']
  })(req, res, next)
}

/**
 * Login Facebook passport
 */
exports.loginGoogle = (req, res, next) => {
  // const data = matchedData(req)
  return googleProvider(req).authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })(req, res, next)
}

/**
 * Login Facebook Callback
 */
exports.loginCbFb = (req, res, next) => {
  return facebookProvider(req).authenticate(
    'facebook',
    { failureRedirect: '/' },
    async (rq, rs) => {
      console.log(rq, rs)
      if (!rq) {
        const { emails, name } = rs
        const dataJson = rs._json // picture
        const emailsArray = _.map(emails, 'value')
        const urlRedirect = process.env.FRONTEND_URL
        const avatar = dataJson && dataJson.picture ? dataJson.picture : ''
        const user = await findByEmailTenant(emailsArray, {
          avatar,
          socialNetwork: [{ provider: 'facebook', id: rs.id }]
        })
        if (!user) {
          const scopes = [
            `?email=${_.head(emailsArray)}`,
            `&name=${name.givenName}`,
            `&lastName=${name.familyName}`,
            `&avatar=${encodeURIComponent(avatar)}`
          ]
          res.redirect(`${urlRedirect}/auth/login${scopes.join('')}`)
        } else {
          const token = generateToken(user._id)
          res.redirect(`${urlRedirect}/auth/callback?token=${token}`)
        }
      } else {
        res.redirect('/')
      }
    }
  )(req, res, next)
}

/**
 * Login Google Callback
 */
exports.loginCbGoogle = (req, res, next) => {
  return googleProvider(req).authenticate(
    'google',
    { failureRedirect: '/', session: false },
    async (rq, rs) => {
      if (!rq) {
        const { emails, name } = rs
        const dataJson = rs._json // picture
        const emailsArray = _.map(emails, 'value')
        const urlRedirect = process.env.FRONTEND_URL
        const avatar = dataJson && dataJson.picture ? dataJson.picture : ''
        const user = await findByEmailTenant(emailsArray, {
          avatar,
          socialNetwork: [{ provider: 'google', id: rs.id }]
        })
        if (!user) {
          const scopes = [
            `?email=${_.head(emailsArray)}`,
            `&name=${name.givenName}`,
            `&lastName=${name.familyName}`,
            `&avatar=${encodeURIComponent(avatar)}`
          ]
          res.redirect(`${urlRedirect}/auth/login${scopes.join('')}`)
        } else {
          const token = generateToken(user._id)
          res.redirect(`${urlRedirect}/auth/callback?token=${token}`)
        }
      } else {
        res.redirect('/')
      }
    }
  )(req, res, next)
}
