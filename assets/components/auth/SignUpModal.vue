<template>
    <b-modal
            id="sign-up-modal"
            title="Fast sign up"
            size="lg"
            body-class="row p-0 m-0"
            hide-footer
            centered
    >
        <div class="col p-3">
            <form @submit.prevent="signup">
                <div class="form-group">
                    <label for="username-input">Nickname</label>
                    <input
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': usernameError }"
                            id="username-input"
                            aria-describedby="username-help"
                            v-model.trim="$v.username.$model"
                    >
                    <div class="invalid-feedback" v-if="usernameError">{{ usernameError }}</div>
                    <small id="username-help" class="form-text text-muted">Your site nickname. Must contains only latin symbols, -, and digits.</small>
                </div>

                <div class="form-group">
                    <label for="email-input">Email</label>
                    <input
                            type="email"
                            class="form-control"
                            :class="{ 'is-invalid': emailError }"
                            id="email-input"
                            aria-describedby="email-help"
                            v-model.lazy.trim="$v.email.$model"
                    >
                    <div class="invalid-feedback" v-if="emailError">{{ emailError }}</div>
                    <small id="email-help" class="form-text text-muted">We'll never share your email with anyone else.</small>
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

                <div class="form-group">
                    <label for="password-confirm-input">Retype password</label>
                    <input
                            type="password"
                            class="form-control"
                            :class="{ 'is-invalid': passwordConfirmError }"
                            id="password-confirm-input"
                            v-model="$v.passwordConfirm.$model"
                    >
                    <div class="invalid-feedback" v-if="passwordConfirmError">{{ passwordConfirmError }}</div>
                </div>

                <div class="text-center btn btn-success w-100 disabled" disabled v-if="this.$store.getters.authStatus === 'loading'">
                    <b-spinner small variant="warning" label="Loading..."></b-spinner>
                    <span>Creating new user...</span>
                </div>
                <button type="submit" class="btn btn-success w-100" :class="{'disabled': this.$store.getters.isCsrfTokenInUpdating}" v-else>
                    Sign Up
                </button>
            </form>
        </div>
        <div class="col d-none d-sm-block p-0">
            <img src="/images/passport-640.png" alt="passport" class="img w-100">
        </div>
    </b-modal>
</template>

<script>
    import { required, minLength, maxLength, email, sameAs } from 'vuelidate/lib/validators';
    import {AUTH_REQUEST} from "../../store/actions/auth";

    export default {
        name: "sign-up-modal",
        data() {
            return {
                username: '',
                email: '',
                password: '',
                passwordConfirm: ''
            }
        },
        computed: {
            usernameError: function () {
                if (!this.$v.username.$error) {
                    return this.$store.getters?.authErrors?.username?.[0] || false;
                }
                if (!this.$v.username.required) {
                    return 'Please enter your nickname.'
                }
                if (!this.$v.username.minLength) {
                    return 'Nickname must have at least ' + this.$v.username.$params.minLength.min + ' letters.';
                }
                if (!this.$v.username.maxLength) {
                    return 'Nickname should be not bigger then ' + this.$v.username.$params.maxLength.max + ' letters.';
                }
                if (!this.$v.username.matchPattern) {
                    return 'Nickname must contains only alphabet/numeric characters and "-" symbol.';
                }
                return false;
            },
            emailError: function () {
                if (!this.$v.email.$error) {
                    return this.$store.getters?.authErrors?.email?.[0] || false;
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
                    return this.$store.getters?.authErrors?.plainPassword?.[0] || false;
                }
                if (!this.$v.password.required) {
                    return 'Please type your new password for account.'
                }
                if (!this.$v.password.minLength) {
                    return 'Password must have at least ' + this.$v.password.$params.minLength.min + ' letters.';
                }
                if (!this.$v.password.maxLength) {
                    return 'Password should be not bigger then ' + this.$v.password.$params.maxLength.max + ' letters.';
                }
            },
            passwordConfirmError: function () {
                if (!this.$v.passwordConfirm.$error) {
                    return false;
                }
                if (!this.$v.passwordConfirm.required) {
                    return 'Please repeat your password.'
                }
                if (!this.$v.passwordConfirm.sameAs) {
                    return 'Password not match.'
                }
            }
        },
        validations: {
            username: {
                required,
                matchPattern(value) {
                    return /^[a-z][a-z\d\-]*[a-z\d]$/i.test(value);
                },
                minLength: minLength(3),
                maxLength: maxLength(15)
            },
            email: {
                required,
                email
            },
            password: {
                required,
                minLength: minLength(6),
                maxLength: maxLength(200)
            },
            passwordConfirm: {
                required,
                sameAs: sameAs('password')
            }
        },
        methods: {
            signup: function () {
                this.$v.$touch();
                if (!this.$v.$invalid) {
                    let data = {
                        username: this.username,
                        email: this.email,
                        plainPassword: this.password,
                        type: 'signup'
                    };
                    this.$store.dispatch(AUTH_REQUEST, data)
                        .then(() => {
                            this.$router.push("/").catch(()=>{});
                        })
                        .catch(() => {
                            let el = document.getElementsByClassName('is-invalid')[0];
                            if (el) {
                                el.scrollIntoView({behavior: 'smooth'});
                            }
                        });
                }
            }
        }
    }
</script>
