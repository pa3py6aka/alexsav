import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from "../actions/user";
import axios from "axios";
import Vue from "vue";
import { AUTH_LOGOUT } from "../actions/auth";

const state = { status: "", profile: {} };

const getters = {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.username
};

const actions = {
    [USER_REQUEST]: ({ commit, dispatch }) => {
        return new Promise((resolve, reject) => {
            commit(USER_REQUEST);
            axios.get('user/me')
                .then(resp => {
                    commit(USER_SUCCESS, resp);
                    resolve(resp);
                })
                .catch(() => {
                    commit(USER_ERROR);
                    // if resp is unauthorized, logout, to
                    dispatch(AUTH_LOGOUT);
                    reject();
                });
        });
    }
};

const mutations = {
    [USER_REQUEST]: state => {
        state.status = "loading";
    },
    [USER_SUCCESS]: (state, userProfileData) => {
        state.status = "success";
        Vue.set(state, "profile", userProfileData);
    },
    [USER_ERROR]: state => {
        state.status = "error";
    },
    [AUTH_LOGOUT]: state => {
        state.profile = {};
        state.status = "";
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
