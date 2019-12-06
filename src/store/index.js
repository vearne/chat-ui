import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);

const state = {
    nickName: ""
};
const mutations = {
    SET_NICKNAME: (state, nickName) => {
        state.nickName = nickName
    },

};
const actions = {};

const getters = {};

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
});
export default store;
