<template>
    <div class="modal-dialog">
        <div class="myPadding">
            昵称:
            <el-input v-model="nickName" @keyup.enter.native="loginPro()"></el-input>
        </div>
        <div class="myPadding">
            <button class="btn btn-primary" v-on:click="loginPro">Join</button>
        </div>
    </div>

</template>

<script>
    export default {
        name: 'Login',
        data() {
            return {
                nickName: ""
            }
        },
        methods: {
            loginPro() {
                // eslint-disable-next-line no-console
                console.log('nickName:', this.nickName);
                this.$store.commit('SET_NICKNAME', this.nickName);
                // jump to new location
                this.$router.push({path: '/chat'});
            }
        }
    }
</script>>

<style>
    .modal-dialog {
        height: 100px;
        width: 200px;
        left: 50%;
        background-color: #B3C0D1;
        padding: 20px;
        margin: auto;
        margin-top:200px;
        /*border: 1px solid blue;*/
    }
    .myPadding{
        margin: 5px;
    }
</style>
