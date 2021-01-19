import {CSRF_UPDATE_ERROR, CSRF_UPDATE_REQUEST, CSRF_UPDATE_SUCCESS} from "../actions/security";
import Vue from 'vue';

const state = {
    csrf_is_updating: false,
    csrf_token: document.head.querySelector('meta[name="csrf-token"]').content
};

const getters = {
    isCsrfTokenInUpdating: state => state.csrf_is_updating,
    getCsrfToken: state => state.csrf_token
};

const actions = {
    [CSRF_UPDATE_REQUEST]: ({commit}) => {
        commit(CSRF_UPDATE_REQUEST);
        Vue.axios.post('/security/get-csrf-token')
            .then(response => {
                if (response.data.result === true) {
                    commit(CSRF_UPDATE_SUCCESS, response.data.token);
                    Vue.$toast.info('CSRF token successfully updated!');
                } else {
                    commit(CSRF_UPDATE_ERROR);
                    Vue.$toast.error('Error while updating CSRF token.');
                }
            })
            .catch(err => {
                commit(CSRF_UPDATE_ERROR);
                Vue.$toast.error('Server error while updating CSRF token.');
            });
    }
};

const mutations = {
    [CSRF_UPDATE_REQUEST]: state => {
        state.csrf_is_updating = true;
    },
    [CSRF_UPDATE_SUCCESS]: (state, token) => {
        state.csrf_is_updating = false;
        state.csrf_token = token;
    },
    [CSRF_UPDATE_ERROR]: state => {
        state.csrf_is_updating = false;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};