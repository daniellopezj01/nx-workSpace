const helperStructureWallet = async (amount, paymentData, idUser) => {
  return new Promise((resolve) => {
    resolve({
      idOperation: paymentData.id,
      amount,
      currency: process.env.TYPE_CURRENCY,
      idReservation: null,
      idUser,
      description: 'abono a monedero',
      customData: paymentData
    })
  })
}

module.exports = { helperStructureWallet }
