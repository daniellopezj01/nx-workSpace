const checkIsNotDeleted = () => new Promise((resolve) => {
  resolve([{ $or: [{ deleted: false }, { deleted: undefined }] }])
})

module.exports = { checkIsNotDeleted }
