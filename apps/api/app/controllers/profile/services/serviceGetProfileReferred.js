const { helperGetCountReffered, helperGetDetailByUser } = require('../../referred/helpers')

const serviceGetProfileReferred = async (id) => {
  const referred = await helperGetDetailByUser(id)
  const usersCount = await helperGetCountReffered(id)
  return new Promise((resolve) => {
    const data = {
      referred,
      usersCount
    }
    resolve(data)
  })
}

module.exports = { serviceGetProfileReferred }
