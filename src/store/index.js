import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);

const state = {
    accountInfo: {nickName: "xxx1", accountId: -1},
    testCount: 1
};
const mutations = {
    SET_NICKNAME: (state, nickName) => {
        state.accountInfo.nickName = nickName
    },
    SET_ACCOUNTID: (state, accountId) => {
        state.accountInfo.accountId = accountId
    },
    INCR: (state) => {
        // eslint-disable-next-line no-console
        console.log("mutations-INCR");
        state.testCount++;
    },
};
const actions = {
    increment (context) {
        setTimeout(() => {context.commit('INCR')},2000);
        // context.commit('increment')
    }
};

const getters = {
    multiTestCount: (state) => (multi) => {
        return state.testCount * 2 * multi
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
});
export default store;
