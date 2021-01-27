/* eslint-disable promise/param-names */
import {
    AUTH_REQUEST,
    AUTH_ERROR,
    AUTH_SUCCESS,
    AUTH_LOGOUT
} from "../actions/auth";
import {USER_SUCCESS} from "../actions/user";
import {CSRF_UPDATE_REQUEST} from "../actions/security";
import qs from 'qs';
import Vue from 'vue';

const state = {
    //token: localStorage.getItem("user-token") || "",
    status: null,
    hasLoadedOnce: false,
    errors: null
};

const getters = {
    isAuthenticated: state => state.status === 'success',
    authStatus: state => state.status,
    authErrors: state => state.errors
};

const actions = {
    [AUTH_REQUEST]: ({ commit, dispatch, rootGetters }, requestData) => {
        return new Promise((resolve, reject) => {
            commit(AUTH_REQUEST);

            let type = requestData.type;
            delete requestData.type;

            requestData['_token'] = rootGetters.getCsrfToken;
            Vue.axios.post(type === 'signup' ? '/auth/signup' : '/login', qs.stringify(requestData))
                .then(response => {
                    let data = response.data;
                    if (!data.result) {
                        let errors = data.errors && Object.keys(data.errors).length ? data.errors : null;
                        commit(AUTH_ERROR, errors);
                        reject();
                        return;
                    }

                    //localStorage.setItem("user-token", response.token);
                    //axios.defaults.headers.common['Authorization'] = resp.token
                    commit(AUTH_SUCCESS, response);
                    commit(USER_SUCCESS, data.user);
                    resolve();
                })
                .catch(err => {
                    commit(AUTH_ERROR, null);
                    //localStorage.removeItem("user-token");
                    Vue.$toast.error('Server error while authorization. Try again later...');
                    reject();
                });
        });
    },
    [AUTH_LOGOUT]: ({ commit, dispatch }, serverLogout) => {
        return new Promise((resolve, reject) => {
            //localStorage.removeItem("user-token");

            if (!serverLogout) {
                commit(AUTH_LOGOUT);
                resolve();
            } else {
                Vue.axios.post('/logout')
                    .then(response => {
                        if (response.data.result) {
                            commit(AUTH_LOGOUT);
                            dispatch(CSRF_UPDATE_REQUEST);
                            resolve();
                        } else {
                            Vue.$toast.error('Server error while logout. Try again later...');
                            reject();
                        }
                    })
                    .catch(() => {
                        Vue.$toast.error('Server error while logout. Try again later...');
                        reject();
                    });
            }
        });
    }
};

const mutations = {
    [AUTH_REQUEST]: state => {
        state.status = "loading";
        state.errors = null;
    },
    [AUTH_SUCCESS]: (state, resp) => {
        state.status = "success";
        //state.token = resp.token;
        state.hasLoadedOnce = true;
    },
    [AUTH_ERROR]: (state, errors) => {
        state.errors = errors;
        state.status = "error";
        state.hasLoadedOnce = true;
    },
    [AUTH_LOGOUT]: state => {
        //state.token = "";
        state.status = null;
        state.errors = null;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
