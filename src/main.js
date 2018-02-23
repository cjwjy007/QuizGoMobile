// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueSocketio from 'vue-socket.io';
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import {baseURL} from './baseURL'

Vue.use(VueSocketio, baseURL);
Vue.use(MintUI)
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>',
  beforeCreate() {
    this.$store.dispatch('cookieLogin');
    if (this.$store.state.auth.username === '') {
      this.$router.push({name: 'UserInput'})
    }
  },
  beforeEnter(to, from, next) {
    if (from.path !== '/') {
      router.go(to.path)
    }
    next()
  }
})
