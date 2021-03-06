/* nuxt.config.js */
// only add `router.base = '/<repository-name>/'` if `DEPLOY_ENV` is `GH_PAGES`
const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    base: '/lajevr/'
  }
} : {};

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat|Raleway&display=swap' }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    'blueprint-css/dist/blueprint.min.css',
    'purecss/build/pure-min.css',
    '~assets/css/index.less'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/global.js',
    { src: '~/plugins/translations.js', mode: 'client' },
    { src: '@/plugins/aos', ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/modules/tree/master/packages/bulma
    '@bazzite/nuxt-optimized-images',
    ['@nuxtjs/pwa', { workbox: false }]
  ],
  /*
   ** Build configuration
   */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend (config, ctx) {
      // Run ESLint on save
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map';
      }
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/i,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
        config.module.rules.push({
          test: /\.(glsl|vs|fx|fs|vert|frag)$/i,
          exclude: /node_modules/,
          use: 'raw-loader'
        });
      }
    }
  },

  pwa: {
    manifest: {
      background_color: '#011d32',
      theme_color: '#0094d7'
    },
    icon: {
      iconFileName: 'images/icons/favicon/icon-laje-512.png'
    },
    meta: {
      name: 'Laje de Santos em Realidade Virtual',
      theme_color: '#0094d7',
      ogHost: 'https://corollarium.github.io/',
      twitterCard: 'summary',
      twitterCreator: '@corollarium'
    }
  },

  optimizedImages: {
    optimizeImages: true,
    optimizeImagesInDev: true,
    responsive: {
      sizes: [ 360, 640, 1080 ],
      placeholder: true
    }
  },
  ...routerBase
};
