const helperDestructureObject = (newObject, oldObject) => new Promise((resolve) => {
  resolve({
    content: newObject.content || oldObject.content,
    vote: newObject.vote || oldObject.vote,
    status: newObject.status || oldObject.status,
    idReservation: newObject.idReservation || oldObject.idReservation,
    idUser: oldObject.idUser,
    attachment: oldObject.attachment,
    customData: oldObject.customData,
    dateCreate: oldObject.dateCreate,
    _id: oldObject._id
  })
})

module.exports = { helperDestructureObject }
