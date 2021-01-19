<template>
    <header v-bind:class="['masthead navbar navbar-dark bg-dark', this.$store.state.navbar_mb_auto ? 'mb-auto' : '']">
        <div class="inner w-100 d-flex align-items-baseline">
            <h3 class="navbar-brand masthead-brand">Alexsav.ru</h3>
            <nav class="nav nav-masthead justify-content-center ml-auto" v-if="!$store.getters.isAuthenticated">
                <a href="#" class="nav-link border-0 p-0" @click="showModal('login-modal')">Login</a>
                <a href="#" class="nav-link border-0 p-0" @click="showModal('sign-up-modal')">Sign Up</a>
            </nav>
            <nav class="nav nav-masthead justify-content-center ml-auto" v-else>
                <router-link to="/profile" class="nav-link" exact-active-class="active">My profile</router-link>
                <a href="#" class="nav-link" @click="logout" ref="logoutLink">
                  <b-spinner small variant="default" label="Loading..." v-if="logoutInProcess"></b-spinner>
                  Logout
                </a>
            </nav>
        </div>
        <nav class="nav nav-masthead justify-content-center">
            <router-link to="/" class="nav-link" exact-active-class="active">Home</router-link>
            <router-link to="/top-news" class="nav-link" exact-active-class="active">Top news</router-link>
        </nav>
    </header>
</template>

<script>
    import CommonMixin from "../mixin";
    import {AUTH_LOGOUT} from "../store/actions/auth";
    import Vue from "vue";

    export default {
        name: "NavBar",
        mixins: [CommonMixin],
        data() {
            return {
                logoutInProcess: false
            };
        },
        methods: {
            logout: function() {
                this.$refs.logoutLink.classList.add('disabled');
                this.logoutInProcess = true;
                this.$store.dispatch(AUTH_LOGOUT, true)
                    .then(() => {
                        Vue.$toast.info('Exited from system.');
                    })
                    .finally(() => {
                        this.logoutInProcess = false;
                        if (this.$refs.logoutLink) {
                            this.$refs.logoutLink.classList.remove('disabled');
                        }
                    });
            }
        }
    }
</script>