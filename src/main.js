import Vue from 'vue'
import App from './App.vue'
import ElemUi from 'element-ui'
import routers from './router'
import store from './store'
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css'
// import VueWebsocket from "vue-websocket";
// Vue.use(VueWebsocket, "ws://localhost:18224/ws");
// // import VueSocketIO from 'vue-socket.io'
// // Vue.use(new VueSocketIO({
// //     debug: true,
// //     connection: 'http://127.0.0.1:18224',
// //     vuex: {
// //         store,
// //         actionPrefix: 'SOCKET_',
// //         mutationPrefix: 'SOCKET_'
// //     },
// //     options: { path: "/ws" } //Optional options
// // }))


Vue.use(ElemUi);
Vue.config.productionTip = false;

const router = new VueRouter({
    mode: 'history',
    routes: routers
})

new Vue({
    el: '#app',
    sockets: {
        connect: function () {
            // eslint-disable-next-line no-console
            console.log('socket connected')
        },
        customEmit: function (data) {
            // eslint-disable-next-line no-console
            console.log('this method was fired', data)
        }
    },
    router,
    store,
    render: h => h(App)
})

