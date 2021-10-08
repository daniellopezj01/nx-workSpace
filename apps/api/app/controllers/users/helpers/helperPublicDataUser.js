const helperPublicDataUser = async (req) => new Promise((resolve) => {
  const user = {
    id: req._id,
    name: req.name,
    surname: req.surname,
    phone: !!req.phone,
    document: !!req.document,
    city: req.city,
    avatar: req.avatar,
    video: req.video,
    country: req.country,
    description: req.description,
    start: req.createdAt,
    email: !!req.email
  }
  resolve(user)
})

module.exports = { helperPublicDataUser }
