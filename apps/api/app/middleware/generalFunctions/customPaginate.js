const _ = require('lodash')

const customPaginate = (data = [], limit = 10, page = 1) =>
  new Promise(async (resolve) => {
    const totalDocs = data.length
    limit = parseFloat(limit)
    page = parseFloat(page)
    const arraysData = _.chunk(data, limit)
    const totalPages = arraysData.length
    const nextPage = totalPages >= page + 1 ? page + 1 : null
    resolve({
      docs: arraysData[page - 1],
      hasNextPage: totalPages >= nextPage,
      hasPrevPage: false,
      limit,
      nextPage,
      page,
      pagingCounter: 1,
      prevPage: null,
      totalDocs,
      totalPages
    })
  })

module.exports = { customPaginate }
