const parseJson = (inString, select = false) => {
  try {
    if (!select) {
      return JSON.parse(inString)
    }
    return JSON.parse(inString)[select]
  } catch (e) {
    return null
  }
}

module.exports = { parseJson }
