<template>
  <div class="main">
    <v-text-field
      v-model="name"
      color="indigo"
      class="name"
      required
      label="Название"
    />

    <v-btn
      :disabled="!isValid"
      color="indigo"
      @click="save"
    >
      <span :class="{ 'white--text': isValid }">Изменить</span>
    </v-btn>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'MainConfig',

    computed: {
      ...mapState({
        game: state => state.game.info,
      }),

      isValid() {
        return (this.name && this.name !== '')
      },

      name: {
        get() {
          return this.game.name
        },
        set(value) {
          this.$store.commit('game/updateGame', { path: 'name', value })
        },
      },
    },

    methods: {
      save() {
        if (this.isValid) {
          this.$store.dispatch('game/updateGame', { axios: this.$axios, params: { ...this.game } })
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .main {
    margin-left: 5px;
    margin-right: 5px;
  }

  .name {
    width: 250px;
  }
</style>
