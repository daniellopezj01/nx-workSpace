const lookupForWord = (q) =>
  new Promise((resolve) => {
    const array = []
    array.push({ title: { $regex: q } })
    array.push({ subTitle: q })
    array.push({ route: q })
    resolve({ $or: array })
  })

module.exports = { lookupForWord }
