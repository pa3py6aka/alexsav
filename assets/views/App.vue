<template>
    <div id="app" class="container d-flex w-100 h-100 mx-auto flex-column">
        <nav-bar></nav-bar>
        <router-view></router-view>
        <main-footer></main-footer>

        <login-modal v-if="!$store.getters.isAuthenticated"></login-modal>
        <sign-up-modal v-if="!$store.getters.isAuthenticated"></sign-up-modal>
    </div>
</template>

<script>
    import NavBar from "../components/NavBar";
    import MainFooter from "../components/MainFooter";
    import LoginModal from "../components/auth/LoginModal";
    import SignUpModal from "../components/auth/SignUpModal";
    import {USER_SUCCESS} from "../store/actions/user";
    import {AUTH_SUCCESS} from "../store/actions/auth";
    export default {
        components: {SignUpModal, LoginModal, MainFooter, NavBar},
        data() {
            return {
                message: 'Hello World'
            }
        },
        watch: {
            $route(to, from) {
                let landingUrls = ['home'];
                if (landingUrls.includes(to.name) && this.$store.state.currentTheme !== 'landing') {
                    this.$store.commit('setTheme', 'landing');
                } else if (!landingUrls.includes(to.name) && this.$store.state.currentTheme === 'landing') {
                    this.$store.commit('setTheme', 'normal');
                }

                document.title = to.meta.title;
            }
        },
        created() {
            if (typeof ALSAV_USER !== 'undefined' && ALSAV_USER) {
                this.$store.commit(AUTH_SUCCESS);
                this.$store.commit(USER_SUCCESS, ALSAV_USER);
            }
        }
    }
</script>