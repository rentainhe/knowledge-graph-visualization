import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import axios from "axios"
import qs from 'qs'
import VueRouter from 'vue-router'
import {routes} from '~/routes'


Vue.prototype.$axios = axios    //全局注册，使用方法为:this.$axios
Vue.prototype.qs = qs           //全局注册，使用方法为:this.qs


Vue.use(ElementUI)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: routes
});


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

