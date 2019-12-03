import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import HelloWorld from '@/components/HelloWorld'
import HChat from '@/components/HChat'

Vue.use(Router)


const routers = [
    {
        path: '/',
        name: 'RootPath',
        components: {
            main:HelloWorld
        }
    },
    {
        path: '/login',
        name: 'login',
        components: {
            main:Login
        }
    },
    {
        path: '/dialogue',
        name: 'dialogue',
        components: {
            main:HelloWorld
        }
    },
    {
        path: '/chat',
        name: 'chat',
        components: {
            main:HChat
        }
    },
]
export default routers
