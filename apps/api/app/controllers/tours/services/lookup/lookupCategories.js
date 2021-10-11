const lookupCategories = () => new Promise((resolve) => {
  resolve({
    $lookup: {
      from: 'categories',
      let: { category: '$category' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $in: ['$_id', '$$category'] }]
            }
          }
        }
      ],
      as: 'category'
    }
  })
})

module.exports = { lookupCategories }
