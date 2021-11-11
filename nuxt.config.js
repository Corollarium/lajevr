/* nuxt.config.js */
// only add `router.base = '/<repository-name>/'` if `DEPLOY_ENV` is `GH_PAGES`
const routerBase = {};

if (process.env.DEPLOY_ENV === 'GH_PAGES') {
  routerBase.base = '/lajevr/';
}

export default {
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
        content: process.env.npm_package_description || 'Laje de Santos em Realidade Virtual'
      }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:wght@400;500;900&family=Raleway&display=swap' },
      { rel: 'icon', type: 'image/png', href: (routerBase.base ?? '/') + 'favicon/favicon-32x32.png' }
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
    'vue-inner-image-zoom/lib/vue-inner-image-zoom.css',
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
    '@nuxtjs/eslint-module',
    '@nuxt/typescript-build',
    '@aceforth/nuxt-optimized-images'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/modules/tree/master/packages/bulma
    ['@nuxtjs/pwa', { workbox: false }]
    // ['@pivale/nuxt-image-loader-module', {
  ],
  /*
   ** Build configuration
   */
  build: {
    transpile: [
      'three',
      '@corollarium/babylon-boids'
    ],
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
      ogHost: 'https://corollarium.github.io/lajevr/',
      ogImage: 'favicon/icon-laje-512.png',
      twitterCard: 'summary',
      twitterCreator: '@corollarium'
    }
  },

  optimizedImages: {
    optimizeImages: true,
    optimizeImagesInDev: false,
    responsive: {
      sizes: [ 360, 640, 1000 ],
      placeholder: true
    }
  },

  router: { ...routerBase }
};
