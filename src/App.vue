<template>
    <div id="app">
        <router-view name='main'/>
<!--        <Login></Login>-->
    </div>
</template>
<script>
    // import Login from './components/Login';
    // import HelloWorld from './components/HelloWorld';
    export default {
        name: 'app',
        components:{
            // Login,
            // HelloWorld
        }
    }
</script>

<style>
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        height: 550px;
    }

</style>
