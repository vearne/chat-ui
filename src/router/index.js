import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Ichat from '@/components/Ichat'
// import Helloworld from '@/components/HelloWorld'

Vue.use(Router);


const routers = [
    {
        path: '/',
        name: 'RootPath',
        components: {
            main: Login
        }
    },
    {
        path: '/login',
        name: 'login',
        components: {
            main: Login
        }
    },
    // {
    //     path: '/hello',
    //     name: 'hello',
    //     components: {
    //         main: Helloworld
    //     }
    // },
    {
        path: '/chat',
        name: 'chat',
        components: {
            main: Ichat
        }
    },
];
export default routers
