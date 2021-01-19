/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './styles/common.css';

import App from './views/App';
import Vue from 'vue';
import store from './store';
import router from './routes.js';

import { ModalPlugin, SpinnerPlugin } from "bootstrap-vue";
Vue.use(ModalPlugin);
Vue.use(SpinnerPlugin);

import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

import Meta from 'vue-meta';
Vue.use(Meta);

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
Vue.use(VueToast);

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);
Vue.axios.defaults.withCredentials = true;

new Vue({
    el: '#app',
    router,
    store,
    //components: { HomePage,  },
    render: h => h(App),
});
