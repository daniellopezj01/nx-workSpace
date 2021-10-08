const lookupUser = (model, query = {}, author = null) =>
  new Promise((resolve) => {
    resolve(
      model.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'idUser',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $match: {
            idUser: author._id
          }
        },
        {
          $match: query
        }
      ])
    )
  })

module.exports = { lookupUser }
