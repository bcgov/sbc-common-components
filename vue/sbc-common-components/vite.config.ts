import EnvironmentPlugin from 'vite-plugin-environment'
import { defineConfig } from 'vite'
import path from 'path'
import postcssNesting from 'postcss-nesting'
import { createVuePlugin as vue } from 'vite-plugin-vue2'

export default defineConfig({
  esbuild: {
    minifySyntax: false,
    minifyIdentifiers: false
  },
  envPrefix: 'VUE_APP_', // Need to remove this after fixing vaults. Use import.meta.env with VUE_APP.
  plugins: [
    vue({
      vueTemplateOptions: {
        transformAssetUrls: {
          img: ['src', 'data-src'],
          'v-app-bar': ['image'],
          'v-avatar': ['image'],
          'v-banner': ['avatar'],
          'v-card': ['image'],
          'v-card-item': ['prependAvatar', 'appendAvatar'],
          'v-chip': ['prependAvatar', 'appendAvatar'],
          'v-img': ['src', 'lazySrc', 'srcset'],
          'v-list-item': ['prependAvatar', 'appendAvatar'],
          'v-navigation-bar': ['image'],
          'v-parallax': ['src', 'lazySrc', 'srcset'],
          'v-toolbar': ['image']
        }
      }
    }),
    EnvironmentPlugin({
      BUILD: 'web' // Fix for Vuelidate, allows process.env with Vite.
    }),
    postcssNesting
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './node_modules'),
      '$assets': path.resolve(__dirname, './src/assets'),
      'vuex-module-decorators': path.resolve(__dirname, './node_modules/vuex-module-decorators/dist/esm/index.js'),
      'vue': path.resolve(__dirname, './node_modules/vue/dist/vue.runtime.js')
    },
    extensions: ['.js', '.ts', '.vue', '.json', '.css']
  },
  server: {
    port: 8080,
    host: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/unit/setup.ts',
    threads: true,
    // hide Vue Devtools message
    onConsoleLog: function (log) {
      if (log.includes('Download the Vue Devtools extension')) {
        return false
      }
    }
  },
  optimizeDeps: {
    exclude: ['keycloak-js']
  }
})
