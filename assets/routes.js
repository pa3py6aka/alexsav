import Vue from 'vue';
import VueRouter from 'vue-router';

import HomePage from './components/HomePage';
import News from "./components/News";
import UserProfile from "./components/user/ProfilePage";

Vue.use (VueRouter);

const router = new VueRouter ({
    mode: 'history',
    routes: [
        { path: '/', name: 'home', component: HomePage, meta: {title: 'Alexsav.ru - Home Page'} },
        { path: '/top-news', name: 'news', component: News, meta: {title: 'Top news from whole world'} },
        { path: '/profile', name: 'user-profile', component: UserProfile, meta: {title: 'Account page.'} }
    ]
});

export default router;