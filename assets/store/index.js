import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import auth from './modules/auth';
import security from './modules/security';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

const store = new Vuex.Store({
    modules: {
        user,
        auth,
        security
    },
    state: {
        currentTheme: 'landing',
        navbar_mb_auto: true,
        //userToken: localStorage.getItem('user-token') || '',
    },
    mutations: {
        setNavbarMBAuto (state) {
            state.navbar_mb_auto = true;
        },
        unSetNavbarMBAuto (state) {
            state.navbar_mb_auto = false;
        },
        setTheme (state, theme) {
            if (theme === 'landing') {
                state.currentTheme = 'landing';
                state.navbar_mb_auto = true;
            } else if (theme === 'normal') {
                state.currentTheme = 'normal';
                state.navbar_mb_auto = false;
            }
        }
    },
    strict: debug
});

export default store;