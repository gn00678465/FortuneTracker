export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'FortuneTracker',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap' }
    ]
  },
  env: {
    collection: 'example2'
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/tailwind.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/input-filter.js',
    { src: '~/plugins/vue-apexcharts.js', ssr: false },
    { src: '~/plugins/mixin.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/moment',
    '@nuxtjs/tailwindcss'
  ],
  moment: {
    /* module options */
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/firebase'
  ],
  firebase: {
    // options
    config: {
      apiKey: 'AIzaSyDs2uHay-1wFArnnQqv-HQGyyZTDBVxeyw',
      authDomain: 'fortunetracker-1bb65.firebaseapp.com',
      projectId: 'fortunetracker-1bb65',
      storageBucket: 'fortunetracker-1bb65.appspot.com',
      messagingSenderId: '904805833444',
      appId: '1:904805833444:web:1f8dae6d0e25480862aaf1',
      measurementId: 'G-0CC9301K05',
      databaseURL: ''
    },
    services: {
      auth: true,
      firestore: true,
      storage: true
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: ['vue-apexcharts']
    // extend (config, { isDev, isClient }) {
    //   if (!isDev) {
    //     config.output.publicPath = './_nuxt/'
    //   }
    //   return config
    // },
    // filenames: {
    //   app: () => '[name].js',
    //   chunk: () => '[name].js'
    // }
  },
  router: {
    middleware: []
  }
}
