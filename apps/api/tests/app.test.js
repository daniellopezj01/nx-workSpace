/* eslint-disable max-statements */


const fs = require('fs')
const server = require('../superTest')

const auth = require('./testAdmin/auth')

const route = `./apps/api/tests/`

const readFolder = async (folder) => {
  fs.readdirSync(`${route}/${folder}`).filter((file) => {
    const property = require(`./${folder}${file}`)
    property(server)
  })
}
describe('*********** app-test ***********', () => {
  // /** ALL FILES ADMIN */
  const admin = 'testAdmin/'
  const api = 'testApi/'
  readFolder(admin)
  readFolder(api)

  // /** SINGLE FILE */
  // auth(server)

})
