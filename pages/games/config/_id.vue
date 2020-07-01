<template>
  <v-app id="inspire">
    <v-main v-if="loaded">
      <v-tabs
        v-model="tab"
        color="indigo"
        grow
        height="30"
      >
        <v-tab class="tab" active-class="tab-active">
          <span :class="[{ 'white--text': tab !== 0 }, 'xolonium-font']">Основые настройки</span>
        </v-tab>
        <v-tab class="tab" active-class="tab-active">
          <span :class="[{ 'white--text': tab !== 1 }, 'xolonium-font']">Изменине в системе</span>
        </v-tab>
        <v-tab class="tab" active-class="tab-active">
          <span :class="[{ 'white--text': tab !== 2 }, 'xolonium-font']">JSON результат</span>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" continuous>
        <v-tab-item>
          <main-config />
        </v-tab-item>
        <v-tab-item>
          <system-config />
        </v-tab-item>
      </v-tabs-items>
    </v-main>
    <loader v-else />
  </v-app>
</template>

<script>
  import { mapState } from 'vuex'
  import Loader from '../../../components/Loader'
  import MainConfig from '../../../components/games/config/MainConfig'
  import SystemConfig from '../../../components/games/config/SystemConfig'

  export default {
    name: 'ConfigGame',

    components: { SystemConfig, MainConfig, Loader },

    data() {
      return {
        tab: null,
      }
    },

    computed: {
      ...mapState({
        game: state => state.game,
        user: state => state.auth.user,
      }),

      loaded() {
        return this.game.loaded
      },
    },

    created() {
      this.$store.dispatch('gameConfig/load', { axios: this.$axios, id: this.$route.params.id, user: this.user })
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .tab {
    background-color: $gray52;
  }

  .tab-active {
    background-color: $white;
  }
</style>
