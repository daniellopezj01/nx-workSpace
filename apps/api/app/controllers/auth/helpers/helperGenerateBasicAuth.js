const helperGenerateBasicAuth = () => new Promise((resolve) => {
  const appIdOauth = process.env.OAUHT_APP_ID || null
  const appSecretOauth = process.env.OAUHT_APP_SECRET || null
  resolve(Buffer.from(`${appIdOauth}:${appSecretOauth}`, 'utf8').toString(
    'base64'
  ))
})

module.exports = { helperGenerateBasicAuth }
