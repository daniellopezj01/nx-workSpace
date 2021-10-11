const helperStructureOrder = async (
  general,
  paymentData,
  idUser,
  amount
) => new Promise((resolve) => {
  const { reservation, tour } = general
  resolve({
    idOperation: paymentData.id,
    amount,
    currency: process.env.TYPE_CURRENCY,
    idUser,
    idReservation: reservation?._id,
    customData: paymentData,
    description: `(${reservation?.code})  ${tour?.title}`
  })
})

module.exports = { helperStructureOrder }
