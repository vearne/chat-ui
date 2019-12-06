import Vue from 'vue'
import App from './App.vue'
import ElemUi from 'element-ui'
import routers from './router'
import store from './store'
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css'


Vue.use(ElemUi);
Vue.config.productionTip = false;

const router = new VueRouter({
    mode: 'history',
    routes: routers
})

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})

