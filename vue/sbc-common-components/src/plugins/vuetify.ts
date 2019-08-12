import 'material-icons/iconfont/material-icons.css' // Ensure you are using css-loader
import 'vuetify/dist/vuetify.min.css'
import Vue from 'vue'
import Vuetify, {
  VAlert
} from 'vuetify/lib'

Vue.use(Vuetify, {
  iconfont: 'md',
  components: {
    VAlert
  }
})
