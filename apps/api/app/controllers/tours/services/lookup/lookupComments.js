const { lookupCreator } = require('./lookupCreator')

const lookupComments = (key = '$tags', withCreator = false) =>
  new Promise(async (resolve) => {
    const creator = await lookupCreator('creator')
    const pipe = [
      {
        $match: {
          $expr: {
            $in: ['$$tagName', '$tags']
          }
        }
      }
    ]
    if (withCreator) {
      pipe.push(creator)
    }
    resolve({
      $lookup: {
        from: 'tags',
        let: {
          tagsTour: key
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$name', '$$tagsTour']
              }
            }
          },
          {
            $lookup: {
              from: 'comments',
              let: {
                tagName: '$name'
              },
              pipeline: pipe,
              as: 'insideComments'
            }
          }
        ],
        as: 'allComments'
      }
    })
  })

module.exports = { lookupComments }
