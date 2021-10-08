const mongoose = require('mongoose')
const { buildSuccObject, buildErrObject, itemNotFound } = require('./utils')

/**
 * Builds sorting
 * @param {string} sort - field to sort from
 * @param {number} order - order for query (1,-1)
 */
const buildSort = (sort, order) => {
  const sortBy = {}
  sortBy[sort] = order
  return sortBy
}

/**
 * Hack for mongoose-paginate, removes 'id' from results
 * @param {Object} result - result object
 */
const cleanPaginationID = (result) => {
  result.docs.map((element) => delete element.id)
  return result
}

/**
 * Builds initial options for query
 * @param {Object} query - query object
 */
const listInitOptions = async (req, removeOrder = false) => {
  return new Promise((resolve) => {
    const order = req.query.order || -1
    const sort = req.query.sort || 'createdAt'
    const sortBy = buildSort(sort, order)
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const projection = req.query.projection || ''
    const options = {
      lean: true,
      page,
      limit,
      projection
    }
    if (!removeOrder) {
      options.sort = sortBy
    }
    resolve(options)
  })
}

module.exports = {
  /**
   * Checks the query string for filtering records
   * query.filter should be the text to search (string)
   * query.fields should be the fields to search into (array)
   * @param {Object} query - query object
   */
  async checkQueryString(query, withRegex = true, and = true) {
    return new Promise((resolve, reject) => {
      try {
        let { filter } = query
        const { fields } = query
        if (!!filter && !!fields) {
          const data = {}
          data[and ? '$and' : '$or'] = []

          const array = []
          filter = filter.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          // Takes fields param and builds an array by splitting with ','
          const arrayFields = fields.split(',')
          // Adds SQL Like %word% with regex
          arrayFields.map((item) => {
            if (withRegex) {
              array.push({
                [item]: { $regex: new RegExp(`.*${filter}.*`, 'i') }
              })
            } else {
              array.push({
                [item]: filter
              })
            }
          })
          // Puts array result in data
          data[and ? '$and' : '$or'] = array
          resolve(data)
        } else {
          resolve({})
        }
      } catch (err) {
        console.log(err.message)
        reject(buildErrObject(422, 'ERROR_WITH_FILTER'))
      }
    })
  },
  /**
   * Gets items from database
   * @param {Object} req - request object
   * @param {Object} query - query object
   */
  async getItems(req, model, query) {
    const options = await listInitOptions(req)
    return new Promise((resolve, reject) => {
      model.paginate(query, options, (err, items) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        resolve(cleanPaginationID(items))
      })
    })
  },

  async findOne(query, model, show = '') {
    return new Promise((resolve, reject) => {
      model.findOne(query, show, (err, items) => {
        if (err || !items) {
          reject(buildErrObject(422, 'NOT_FOUND'))
        }
        resolve(items)
      })
    })
  },
  async findOneBoolean(query, model, show = '') {
    return new Promise((resolve) => {
      model.findOne(query, show, (err, items) => {
        if (err || !items) {
          resolve(false)
        }
        resolve(items)
      })
    })
  },
  async find(query, model, show = '') {
    return new Promise((resolve, reject) => {
      model.find(query, show, (err, items) => {
        if (err || !items) {
          reject(buildErrObject(422, 'NOT_FOUND'))
        }
        resolve(items)
      })
    })
  },

  /**
   * Gets item from database by id
   * @param {string} id - item id
   */
  async getItem(id, model) {
    return new Promise((resolve, reject) => {
      model.findById(id, (err, item) => {
        itemNotFound(err, item, reject, 'NOT_FOUND')
        resolve(item)
      })
    })
  },

  /**
   *
   * @param {*} req
   * @param {*} model
   */

  async getItemBySlug(id, model) {
    return new Promise((resolve, reject) => {
      model.findOne({ slug: id }, (err, item) => {
        itemNotFound(err, item, reject, 'NOT_FOUND')
        resolve(item)
      })
    })
  },

  getLookConversations(model, query = {}, author = null) {
    return model.aggregate([
      {
        $match: {
          members: { $in: [mongoose.Types.ObjectId(author._id)] }
        }
      },
      {
        $lookup: {
          from: 'users',
          let: { members: '$members' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ['$_id', '$$members'] }]
                }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                surname: 1,
                avatar: 1
              }
            }
          ],
          as: 'members'
        }
      },
      {
        $match: query
      },
      {
        $project: {
          _id: 1,
          messages: { $slice: ['$messages', 0, 5] },
          members: 1,
          hash: 1,
          type: 1,
          toFrom: {
            $filter: {
              input: '$members',
              as: 'member',
              cond: {
                $ne: ['$$member._id', mongoose.Types.ObjectId(author._id)]
              }
            }
          },
          firstMessage: { $slice: ['$messages', 0, 1] },
          createdAt: 1,
          updatedAt: 1
        }
      },
      { $unwind: '$firstMessage' },
      { $unwind: '$toFrom' }
    ])
  },

  getLookWallet(model, query = {}, author = null) {
    return model.aggregate([
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
  },

  getLookReferred(model, query = {}) {
    return model.aggregate([
      {
        $lookup: {
          from: 'referredsettings',
          localField: 'typeReferred',
          foreignField: '_id',
          as: 'ref'
        }
      },
      { $unwind: '$ref' },
      {
        $match: query
      }
    ])
  },

  getLookReferredCount(model, query = {}) {
    return model.aggregate([
      {
        $lookup: {
          from: 'referredusers',
          localField: '_id',
          foreignField: 'userFrom',
          as: 'ref'
        }
      },
      { $unwind: '$ref' },
      {
        $match: query
      },
      { $group: { _id: null, count: { $sum: 1 } } }
    ])
  },

  getLookiListReferred(model, query = {}) {
    return model.aggregate([
      {
        $lookup: {
          from: 'users',
          let: { usetTo: '$userTo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$usetTo'] }]
                }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                surname: 1,
                avatar: 1
              }
            }
          ],
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $match: query
      }
    ])
  },

  /**
   * Creates a new item in database
   * @param {Object} req - request object
   */
  async createItem(req, model) {
    return new Promise((resolve, reject) => {
      model.create(req, (err, item) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        resolve(item)
      })
    })
  },

  /**
   * Updates an item in database by id
   * @param {string} id - item id
   * @param {Object} req - request object
   */
  async updateItem(id, model, req) {
    return new Promise((resolve, reject) => {
      model.findByIdAndUpdate(
        id,
        req,
        {
          new: true,
          runValidators: true
        },
        (err, item) => {
          itemNotFound(err, item, reject, 'NOT_FOUND')
          resolve(item)
        }
      )
    })
  },
  /**
   * Updates an item in database by id
   * @param {string} id - item id
   * @param {Object} req - request object
   */
  async updateByOtherField(hash, model, req) {
    return new Promise((resolve, reject) => {
      model.findOneAndUpdate(
        hash,
        req,
        {
          new: true,
          runValidators: true
        },
        (err, item) => {
          itemNotFound(err, item, reject, 'NOT_FOUND')
          resolve(item)
        }
      )
    })
  },

  /**
   * Deletes an item from database by id
   * @param {string} id - id of item
   */
  async deleteItem(id, model) {
    return new Promise((resolve) => {
      model.deleteById(id, (error, itemFind) => {
        if (error) {
          console.log(error.message)
        }
        resolve(buildSuccObject('DELETED', itemFind))
      })
    })
  },

  async findCheckSingle(model) {
    return new Promise((resolve, reject) => {
      model.findOne({ key: 'defaultCurrencies' }, 'name currencies payAmount -_id', (err, item) => {
        itemNotFound(err, item, reject, 'SETTINGS_NOT_WORK')
        resolve(item)
      })
    })
  },

  /**
   * Gets items from database
   * @param {Object} req - request object
   * @param {Object} query - query object
   */
  async getItemsAggregate(req, model, aggregate, removeOrder = false) {
    // let options = {}
    // if (activeOptions) {
    const options = await listInitOptions(req, removeOrder)
    // }
    return new Promise((resolve, reject) => {
      model.aggregatePaginate(aggregate, options, (err, items) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        resolve(cleanPaginationID(items))
      })
    })
  }
}
