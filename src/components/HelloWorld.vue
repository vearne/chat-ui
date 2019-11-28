<template>
    <div class="hello">
        <h1>{{ this.$store.state.accountInfo.nickName }}</h1>
        <h1>{{ this.$store.state.testCount }}</h1>
        <h1>{{ this.$store.getters.multiTestCount(3)}}</h1>
        <button @click="incr()">增加</button>
        <button @click="lazyIncr()">延迟增加</button>
    </div>
</template>

<script>
    // import { mapMutations } from 'vuex'
    export default {
        name: 'HelloWorld',
        data() {
            return {
                // currUser: this.$store.state.accountInfo.nickName,
                // count: this.$store.state.testCount,
                // newCount: this.$store.getters.multiTestCount(3)
            };
        },
        methods:{
            incr(){
                // eslint-disable-next-line no-console
                console.log("incr");
                this.$store.commit("INCR");
            },
            lazyIncr(){
                // eslint-disable-next-line no-console
                console.log("lazyIncr");
                this.$store.dispatch("increment");
            }
        }
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
