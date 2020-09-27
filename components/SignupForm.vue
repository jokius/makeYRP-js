<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="indigo" dark flat>
              <v-toolbar-title>Регистрация</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="isValid">
                <v-text-field
                  v-model="inputNickname"
                  color="indigo"
                  required
                  :rules="requiredRules"
                  label="Ник"
                  prepend-icon="mdi-account"
                />

                <v-text-field
                  v-model="inputEmail"
                  color="indigo"
                  required
                  :rules="emailRules"
                  :error-messages="asyncEmailErrors"
                  label="Email"
                  prepend-icon="mdi-email"
                  type="email"
                />

                <v-text-field
                  v-model="inputPassword"
                  color="indigo"
                  required
                  :rules="requiredRules"
                  :error-messages="asyncPasswordErrors"
                  label="Пароль"
                  prepend-icon="mdi-lock"
                  type="password"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <nuxt-link to="login">Войти</nuxt-link>
              <v-spacer />
              <v-btn
                dark
                color="indigo"
                @click="validate"
              >
                Зарегистрироваться
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
  import { emailRules, requiredRules } from '~/lib/validationRules'

  export default {
    data: () => ({
      emailRules,
      requiredRules,
      isValid: false,
      user: {
        email: '',
        nickname: '',
        password: '',
      },

      errors: {},
      sending: false,
    }),

    computed: {
      inputEmail: {
        get() {
          return this.user.email
        },

        set(value) {
          this.clearErrors()
          this.user.email = value
        },
      },

      inputNickname: {
        get() {
          return this.user.nickname
        },

        set(value) {
          this.clearErrors()
          this.user.nickname = value
        },
      },

      inputPassword: {
        get() {
          return this.user.password
        },

        set(value) {
          this.clearErrors()
          this.user.password = value
        },
      },

      asyncEmailErrors() {
        const errors = this.errors.email || []
        return errors || errors.join(', ')
      },

      asyncPasswordErrors() {
        const errors = this.errors.password || []
        return errors || errors.join(', ')
      },
    },

    methods: {
      clearErrors() {
        this.isValid = true
        this.errors = {}
      },

      validate() {
        if (this.$refs.form.validate()) {
          this.sending = true

          this.$axios.post('/users', { user: this.user }).then(response => {
            this.$auth.setToken('local', response.data)
            if (this.isValid) this.$router.push('/')
          }).catch(error => {
            this.errors = error.response.data.errors
          }).finally(() => this.sending = false)
        }
      },
    },
  }
</script>
