<template>
  <div class="form-grid">
    <div class="form-col-1">
      <v-avatar width="200" height="auto" tile @click="selectImage">
        <v-img :src="url" />
      </v-avatar>
      <input
        ref="fileInput"
        accept="image/png, image/jpeg"
        placeholder="Новая аватарка"
        type="file"
        @input="pickFile"
      />
    </div>
    <div class="form-col-2">
      <v-text-field
        v-model="nickname"
        color="indigo"
        class="name"
        required
        label="Ник"
      />

      <p>Базовый цвет</p>
      <v-color-picker
        v-model="color"
        color="indigo"
      />
    </div>

    <div class="actions">
      <v-btn
        color="indigo"
        dark
        nuxt
        to="/"
      >
        <span>К списку игр</span>
      </v-btn>

      <v-btn
        color="indigo"
        dark
        @click="save"
      >
        <span>Изменить</span>
      </v-btn>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import { updateUser } from '~/api/user'
import { UserModel } from '~/models/UserModel'

export default {
  data: () => ({
    avatar: null,
    private: {
      url: null,
      nickname: null,
      color: null,
    },
  }),

  computed: {
    ...mapState({
      user: state => state.auth.user,
    }),

    url() {
      return this.private.url || this.user.imgThumb
    },

    nickname: {
      get() {
        return this.private.nickname || this.user.nickname
      },

      set(value) {
        this.private.nickname = value
      },
    },

    color: {
      get() {
        return this.private.color || this.user.color
      },

      set(value) {
        this.private.color = value
      },
    },
  },

  methods: {
    selectImage() {
      this.$refs.fileInput.click()
    },

    pickFile(e) {
      const file = e.target.files[0]
      this.avatar = file || null

      if (file) {
        this.private.url = URL.createObjectURL(file)
      } else {
        this.private.url = null
      }
    },

    save() {
      updateUser({
        axios: this.$axios,
        params: {
          nickname: this.nickname,
          color: this.color,
          avatar: this.avatar,
        }
      }).then(user => {
        this.$auth.setUser(new UserModel().setInfo(user))
        this.$router.push('/')
      })
    },
  }
}
</script>

<style scoped lang="scss">
.form-grid {
  display: grid;
  grid-template-columns: 200px max-content;
  grid-column-gap: 10px;
  margin-top: 10px;
  margin-left: 10px;
}

.form-col-1 {
  display: block;
}

.actions {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-column-gap: 10px;
}
</style>
