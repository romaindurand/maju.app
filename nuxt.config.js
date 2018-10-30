require('dotenv').config()

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'maju.app',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'A web app to create polls using the majority judgement voting system' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit', async: undefined, defer: undefined }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  router: {
    middleware: 'i18n'
  },
  proxy: [
    process.env.NODE_ENV === 'production' ? 'https://maju.app:5000/api' : 'http://localhost:5000/api'
  ],
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  plugins: ['~/plugins/i18n.js', '~/plugins/fontawesome.js'],
  modules: ['@nuxtjs/proxy', '@nuxtjs/axios'],
  axios: {
    proxy: true
    // proxyHeaders: false
  },
  /*
  ** Build configuration
  */
  env: {
    RECAPTCHA_SITEKEY: process.env.RECAPTCHA_SITEKEY
  },
  build: {
    vendor: ['vue-i18n'],
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
