module.exports = {
  settings: {
    // ...
    algolia: {
      enabled: true,
      applicationId: process.env.ANGOLIA_APP_ID,
      apiKey: process.env.ANGOLIA_SECRET_API_KEY,
      debug: true // default: false
      // prefix: 'my_own_prefix' // default: Strapi environment (strapi.config.environment)
    }
  }
}
