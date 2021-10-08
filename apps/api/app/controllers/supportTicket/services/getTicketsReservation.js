const getTicketsReservation = (query) => new Promise((resolve) => {
  const aggregate = []
  aggregate.push({
    $match: query
  })
  aggregate.push({
    $addFields: {
      firstMessage: { $arrayElemAt: ['$messages', -1] }
    }
  })
  aggregate.push({
    $project: {
      messages: 0
    }
  })

  resolve(aggregate)
})

module.exports = { getTicketsReservation }
