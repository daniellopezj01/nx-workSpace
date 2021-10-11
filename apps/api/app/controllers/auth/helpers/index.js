const { blockIsExpired } = require('./blockIsExpired')
const { blockUser } = require('./blockUser')
const { checkPermissions } = require('./checkPermissions')
const { findUser } = require('./findUser')
const { findUserByAccessToken } = require('./findUserByAccessToken')
const { findUserById } = require('./findUserById')
const { generateToken } = require('./generateToken')
const { getUserIdFromToken } = require('./getUserIdFromToken')
const { passwordsDoNotMatch } = require('./passwordsDoNotMatch')
const { returnRegisterToken } = require('./returnRegisterToken')
const { saveLoginAttemptsToDB } = require('./saveLoginAttemptsToDB')
const {
  saveUserAccessAndReturnToken
} = require('./saveUserAccessAndReturnToken')
const { setUserInfo } = require('./setUserInfo')
const { updatePassword } = require('./updatePassword')
const { verificationExists } = require('./verificationExists')
const { verifyUser } = require('./verifyUser')
const { helperGenerateBasicAuth } = require('./helperGenerateBasicAuth')
const { helperRoleNotAllowed } = require('./helperRoleNotAllowed')
const { helperFindByEmail } = require('./helperFindByEmail')
const { helperRegisterUser } = require('./helperRegisterUser')
const { helperDownload } = require('./helperDownload')
const { findForgotPassword } = require('./findForgotPassword')
const { forgotPasswordResponse } = require('./forgotPasswordResponse')
const { saveForgotPassword } = require('./saveForgotPassword')

module.exports = {
  blockIsExpired,
  blockUser,
  checkPermissions,
  findUser,
  findUserById,
  findUserByAccessToken,
  generateToken,
  getUserIdFromToken,
  passwordsDoNotMatch,
  returnRegisterToken,
  saveLoginAttemptsToDB,
  saveUserAccessAndReturnToken,
  setUserInfo,
  updatePassword,
  verificationExists,
  verifyUser,
  helperGenerateBasicAuth,
  helperRoleNotAllowed,
  helperFindByEmail,
  helperRegisterUser,
  helperDownload,
  findForgotPassword,
  forgotPasswordResponse,
  saveForgotPassword
}
