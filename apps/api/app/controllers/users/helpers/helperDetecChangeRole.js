const User = require('../../../models/user')

const helperDetecChangeRole = (idUser, userUpdated) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(
        idUser,
        '_id name surname email role avatar'
      )
      resolve(user.role !== userUpdated.role ? user : null)
    } catch (error) {
      reject(error)
    }
  })

module.exports = { helperDetecChangeRole }
