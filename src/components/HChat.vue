<template>
    <div class="wrap">
        <div class="wrap-main">
            <div class="msg-list">
                <MsgList/>
            </div>
            <div class="msg-input">
                <MsgWriter/>
            </div>
        </div>
        <div class="wrap-left">
        </div>
    </div>
</template>
<script>
    import MsgList from './message/MsgList'
    import MsgWriter from './message/MsgWriter'
    // import { mapGetters } from 'vuex'
    // import { Keys } from '../uitls'
    // let getUsers = Keys.GETUSERS

    export default {
        name: 'HChat',
        components: {
            MsgList,
            MsgWriter
        },
        computed: {
            // ...mapGetters([getUsers])
        }
    }
</script>

<style>
    .wrap{
        height:100%;
    }
    .wrap-left{
        width: 200px;
        float:left;
        height:100%;
        margin-left: -100%;
        background: linear-gradient(#20A0FF,#58B7FF);
    }
    .wrap-main{
        float:left;
        padding-left: 200px;
        height:100%;
        width:100%; /*因为float了，必须要有width，否则宽度为0px*/
        text-align:left;
    }
    .msg-list{
        height: 80%;
        border: 10px solid #58B7FF;
    }
    .msg-input{
        height: 80%;
        border: 10px solid #58B7FF;
    }
</style>
