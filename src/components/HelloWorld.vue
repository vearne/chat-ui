<template>
    <div class="hello">
        <!--        <h1>{{ this.$store.state.accountInfo.nickName }}</h1>-->
        <!--        <h1>{{ this.$store.state.testCount }}</h1>-->
        <!--        <h1>{{ this.$store.getters.multiTestCount(3)}}</h1>-->
        <!--        <button @click="incr()">增加</button>-->
        <!--        <button @click="lazyIncr()">延迟增加</button>-->
        <el-input v-model="msg"></el-input>
        <button @click="websocketsend()">sendMessage</button>
    </div>
</template>

<script>
    export default {
        name: 'HelloWorld',
        data() {
            return {
                websock: null,
                msg: ""
            }
        },
        created() {
            this.initWebSocket();
        },
        destroyed() {
            this.websock.close() //离开路由之后断开websocket连接
        },
        methods: {
            initWebSocket() { //初始化weosocket
                const wsuri = "ws://127.0.0.1:18224/ws";
                this.websock = new WebSocket(wsuri);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen() { //连接建立之后执行send方法发送数据
                let actions = {"test": "12345"};
                this.websocketsend(JSON.stringify(actions));
            },
            websocketonerror() {//连接建立失败重连
                this.initWebSocket();
            },
            websocketonmessage(e) { //数据接收
                // const redata = JSON.parse(e.data);
                // eslint-disable-next-line no-console
                console.log('get msg', e.data);
            },
            websocketsend() {//数据发送
                // eslint-disable-next-line no-console
                console.log('send msg', this.msg);
                this.websock.send(this.msg);
            },
            websocketclose(e) {  //关闭
                // eslint-disable-next-line no-console
                console.log('断开连接', e);
            },
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
