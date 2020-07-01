<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <loader v-if="!loaded" />
            <games-list v-if="loaded" :games="games.list" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex'
  import Loader from '../../../components/Loader'
  import GamesList from '../../../components/admin/games/GamesList'

  export default {
    name: 'Games',
    components: { GamesList, Loader },

    computed: {
      ...mapState({
        user: state => state.auth.user,
        games: state => state.admin.games,
      }),

      loaded() {
        return this.games.loaded
      },
    },

    created() {
      if (!this.user.admin) return this.$router.push('/')

      this.$store.dispatch('admin/games/load', this.$axios)
    },
  }
</script>
