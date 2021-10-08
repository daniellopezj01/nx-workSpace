const helperStructureExternalOrder = async (generalData, paymentData, idUser) => new Promise((resolve) => {
  const { externalCode, operationType, amount } = generalData
  resolve({
    idOperation: paymentData.id,
    amount,
    currency: process.env.TYPE_CURRENCY,
    externalCode,
    operationType,
    idUser,
    customData: paymentData,
    description: `(${operationType})  ${externalCode}`
  })
})

module.exports = { helperStructureExternalOrder }
