const lookupScore = (key = '$comments.vote') =>
  new Promise((resolve) => {
    const data = [
      {
        $addFields: {
          average: {
            $avg: key
          }
        }
      },
      {
        $addFields: {
          score: {
            $round: ['$average', 1]
          }
        }
      }
    ]
    resolve(data)
  })

module.exports = { lookupScore }
