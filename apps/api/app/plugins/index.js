const fs = require('fs')

const routesPath = `${__dirname}/`
// const {removeExtensionFromFile} = require('../middleware/utils')
const mongoose = require('mongoose')
const model = require('../models/plugins')

const namePlugin = []

const installPlugin = (file = null) => new Promise((resolve) => {
  fs.readFile(`${routesPath}/${file}/info.json`, (err, data) => {
    try {
      if (err) {
        console.log('installPlugin:', err.message)
      } else {
        data = JSON.parse(data)
        const query = { path: data.path }
        const options = { upsert: true, new: true, setDefaultsOnInsert: true }
        model.findOneAndUpdate(query, data, options, (error, result) => {
          if (!err) {
            resolve(result)
          }
        })
      }
    } catch (error) {
      console.log('error installPlugins', error.message)
    }
  })
})

fs.readdirSync(routesPath).filter(
  (file) => new Promise((resolve) => {
    const check = fs.lstatSync(`${routesPath}/${file}`).isDirectory()
    if (check) {
      installPlugin(file).then(() => {
        require(`${routesPath}/${file}/index.js`)
        namePlugin.push(file)
        resolve(true)
      })
    }
  })
)

exports.modules = () => namePlugin

exports.modFindById = (_id = null) => new Promise((resolve, reject) => {
  model.findById(mongoose.Types.ObjectId(_id), (err, item) => {
    if (err) {
      reject(err)
    } else {
      resolve(item)
    }
  })
})
