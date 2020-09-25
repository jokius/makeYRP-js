<template>
  <v-app id="inspire">
    <v-main v-if="user">
      <v-container class="fill-height" fluid>
        <div class="user-grid">
          <v-avatar
            :key="user.id" size="36"
            :style="{ border: `2px solid ${user.color}`, backgroundColor: user.color }"
          >
            <img
              v-if="user.imgThumb"
              :src="user.imgThumb"
              :alt="user.nickname"
            />
            <v-icon v-if="!user.imgThumb" dark>mdi-account-circle</v-icon>
          </v-avatar>
          <v-btn
            tile
            color="indigo"
            dark
            @click="logout"
          >
            Выйти
          </v-btn>
        </div>
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <loader v-if="!loaded" />
            <actions v-if="loaded" />
            <tabs v-if="loaded" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex'
  import Actions from '../components/games/Actions'
  import Tabs from '../components/games/Tabs'
  import Loader from '../components/Loader'
  import { UserModel } from '~/models/UserModel'

  export default {
    components: { Loader, Tabs, Actions },

    computed: {
      ...mapState({
        games: state => state.games,
        loaded: state => state.games.loaded,
        user: state => state.auth.user,
      }),
    },

    created() {
      if (this.user.data) this.$auth.setUser(new UserModel().setInfo(this.user)) // fix login
      this.$store.dispatch('games/load', this.$axios)
    },

    methods: {
      logout: function () {
        this.$auth.logout().catch(e => {this.error = e + ''}).then(() => this.$router.push('/login'))
      }
    },
  }
</script>

<style scoped lang="scss">
  .user-grid {
    position: absolute;
    right: 5px;
    top: 5px;
  }
</style>
