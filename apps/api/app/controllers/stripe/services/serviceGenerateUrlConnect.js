const serviceGenerateUrlConnect = async (user, stripeId) => new Promise((resolve) => {
  const url = [
    'https://connect.stripe.com/express/oauth/authorize',
    `?client_id=${stripeId}`,
    '&state={STATE_VALUE}',
    `&stripe_user[email]=${user.email}`,
    '&stripe_user[business_type]=individual',
    `&stripe_user[first_name]=${user.name}`,
    `&redirect_uri=${process.env.FRONTEND_URL}/user/agency-link-callback`
  ].join('')
  resolve({ url })
})

module.exports = { serviceGenerateUrlConnect }
