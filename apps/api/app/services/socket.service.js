/* eslint-disable camelcase */
const _ = require('lodash')
const { getUserIdFromToken } = require('../controllers/auth/helpers')
const db = require('../middleware/db')
const User = require('../models/user')

let ioGlobal
const emitEvent = async (io, event) => {
  try {
    if (event.event.includes('new_message') && event && event.payload) {
      const { payload } = event
      const message = _.head(payload.messages)
      const userMerge = _.filter(
        _.map(payload.members, (e) => `${e}`),
        (a) => a !== message.creator
      )
      const fromUser = _.filter(
        _.map(payload.members, (e) => `${e}`),
        (a) => a === message.creator
      )
      const fromUserObj = await db.findOne({ _id: fromUser }, User)
      const userMergeObj = await db.findOne({ _id: userMerge }, User)

      userMerge.forEach((user) => {
        const room = `room_${user}`
        io.to(room).emit('push_message', {
          event: event.event,
          payload: {
            message,
            fromUser,
            userMerge,
            fromUserObj,
            userMergeObj,
            hash: payload.hash
          }
        })
      })
    }
  } catch (error) {
    console.log('socket', error.message)
  }
}

exports.init = (io = {}) => {
  ioGlobal = io
  io.on('connection', async (socket) => {
    try {
      const { token } = socket.handshake.query
      const user = await getUserIdFromToken(token)
      const channel = `room_${user}`
      socket.join(channel)
      socket.on('push_message', (res) => emitEvent(io, res))
    } catch (e) {
      console.log('error socket,', e.message)
    }
  })
}
exports.emitEventToUsers = (event) => emitEvent(ioGlobal, event)
