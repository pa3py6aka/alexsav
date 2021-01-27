<template>
    <b-modal
            id="login-modal"
            title="Login"
            size="md"
            hide-footer
            centered
    >
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="email-input">Email</label>
                <input
                        type="email"
                        class="form-control"
                        :class="{ 'is-invalid': emailError }"
                        id="email-input"
                        v-model.lazy.trim="$v.email.$model"
                >
                <div class="invalid-feedback" v-if="emailError">{{ emailError }}</div>
            </div>

            <div class="form-group">
                <label for="password-input">Password</label>
                <input
                        type="password"
                        class="form-control"
                        :class="{ 'is-invalid': passwordError }"
                        id="password-input"
                        v-model="$v.password.$model"
                >
                <div class="invalid-feedback" v-if="passwordError">{{ passwordError }}</div>
            </div>

            <div class="form-group form-check">
                <input
                        type="checkbox"
                        class="form-check-input"
                        id="remember-me-check"
                        v-model="rememberMe"
                        value="1"
                >
                <label class="form-check-label" for="remember-me-check">Remember me</label>
            </div>

            <div class="text-center btn btn-success w-100 disabled" disabled v-if="this.$store.getters.authStatus === 'loading'">
                <b-spinner small variant="warning" label="Loading..."></b-spinner>
                <span>Trying to login...</span>
            </div>
            <button type="submit" class="btn btn-success w-100" :class="{'disabled': this.$store.getters.isCsrfTokenInUpdating}" v-else>
                Login
            </button>
        </form>
    </b-modal>
</template>

<script>
    import Vue from 'vue';
    import {email, required} from "vuelidate/lib/validators";
    import {AUTH_REQUEST} from "../../store/actions/auth";

    export default {
        name: "login-modal",
        data() {
            return {
                email: '',
                password: '',
                rememberMe: true
            }
        },
        computed: {
            emailError: function () {
                if (!this.$v.email.$error) {
                    return this.$store.getters?.authErrors?.email || false;
                }
                if (!this.$v.email.required) {
                    return 'Please enter your email address.'
                }
                if (!this.$v.email.email) {
                    return 'This is not valid email address.'
                }
                return false;
            },
            passwordError: function () {
                if (!this.$v.password.$error) {
                    return this.$store.getters?.authErrors?.password || false;
                }
                if (!this.$v.password.required) {
                    return 'Please type your password for account.';
                }
            }
        },
        methods: {
            login: function () {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    let data = {
                        email: this.email,
                        password: this.password,
                        _remember_me: this.rememberMe,
                        type: 'login'
                    };
                    this.$store.dispatch(AUTH_REQUEST, data)
                        .then(() => {
                            this.$bvModal.hide('login-modal');
                            Vue.$toast.success('You are logged in.');
                        })
                        .catch(() => {
                            let el = document.getElementsByClassName('is-invalid')[0];
                            if (el) {
                                el.scrollIntoView({behavior: 'smooth'});
                            }
                        });
                }
            }
        },
        validations: {
            email: {
                required,
                email
            },
            password: {
                required
            }
        },
    }
</script>
