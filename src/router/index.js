import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)


const routers = [
    {
        path: '/',
        name: 'RootPath',
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
]
export default routers
