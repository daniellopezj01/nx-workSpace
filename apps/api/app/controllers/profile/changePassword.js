const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')

const changePassword = async (req, res) => {
  try {
    const { accessToken } = req.user
    req = matchedData(req)
    req = { ...req, accessToken }
    const { url, header } = await utils.structureRequest()
    utils.httpRequest$(`${url}/profile/changePassword`, 'post', header, req).subscribe(
      async (response) => {
        res.status(200).json(response)
      },
      (err) => {
        console.log(err.message)
        utils.handleErrorHooks(res, err)
      }
    )
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { changePassword }
