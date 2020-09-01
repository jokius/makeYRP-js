module.exports = {
  target: 'static',
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'make YRP',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Стол для настольных ролевых игр' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v1' },
    ]
  },

  loading: { color: '#513d70' },

  build: {
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    },

    splitChunks: {
      layouts: true,
      pages: true,
      commons: true,
    },

    optimization: {
      minimize: true,
    }
  },

  buildModules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/vuetify',
  ],

  css: [
    '~/assets/css/dices.scss',
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
  ],

  auth: {
    strategies: {
      local: {
        endpoints: {
          login:  { url: '/users/sign_in' },
          logout: { url: '/users/sign_out', method: 'delete' },
          user:   { url: '/users/current', propertyName: '' },
        },
      },
    },
    plugins: [
      '~/plugins/auth.js',
    ],
  },

  axios: {
    baseUrl: process.env.API_URL,
  },

  env: {
    wsUrl: process.env.WS_URL,
    baseUrl: process.env.API_URL,
  },

  router: {
    middleware: ['auth'],
  },

  plugins: [
    { src: '~/plugins/actioncable-vue', ssr: false },
    { src: '~/plugins/dragDrop', ssr: false },
    { src: '~/plugins/wysiwyg', ssr: false },
    { src: '~/plugins/konva', ssr: false },
  ],

  vue: {
    config: ({ isDev }) => ({
      devtools: isDev,
    })
  }
}
