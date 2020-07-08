<template>
  <v-list three-line>
    <template v-for="game in games">
      <v-list-item :key="`game-${game.id}`" class="border-bottom">
        <v-list-item-content>
          <div class="title-grid">
            <span class="game-title">{{ game.name }}</span>
            <v-btn color="success" max-width="150" @click="openGame(game.id)">Загрузить</v-btn>
            <template v-if="game.master.id === user.id">
              <v-btn color="grey lighten-1" max-width="50" link :to="`/games/config/${game.id}`">
                <v-icon dark>mdi-cog</v-icon>
              </v-btn>
              <v-btn v-if="isOpen" color="red darken-4" dark max-width="150" @click="endGame(game.id)">
                <v-icon dark>mdi-delete</v-icon>
              </v-btn>
              <v-btn v-else color="success" max-width="150" @click="startGame(game.id)">Востановить</v-btn>
            </template>
          </div>
          <v-list-item-subtitle>
            <span class="list-title">Мастер:</span>
            <v-avatar size="24" color="indigo">
              <img
                v-if="game.master.avatar.thumb"
                :src="game.master.avatar.thumb"
                :alt="game.master.nickname"
              />
              <v-icon
                v-if="!game.master.avatar.thumb"
                dark
                :title="game.master.nickname"
              >
                mdi-account-circle
              </v-icon>
            </v-avatar>
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <span class="list-title">Игроки:</span>
            <span v-if="game.users.length === 0">Нет</span>
            <template v-else>
              <v-avatar v-for="user in game.users" :key="`user-${user.id}`" size="24" color="indigo" class="user">
                <img
                  :src="user.imgChat"
                  :alt="user.nickname"
                  :title="user.nickname"
                />
              </v-avatar>
            </template>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
  import { mapState } from 'vuex'

  import { joinGame } from '../../api/games'

  export default {
    name: 'GamesList',

    props: {
      games: { type: Array, required: true },
      isOpen: { type: Boolean, default: false },
    },

    computed: {
      ...mapState({
        user: state => state.auth.user,
      }),
    },

    methods: {
      openGame(id) {
        joinGame({ axios: this.$axios, id }).then(() =>
          this.$router.push(`/games/${id}`)
        )
      },

      endGame(id) {
        this.$store.dispatch('games/endGame', { axios: this.$axios, id })
      },

      startGame(id) {
        this.$store.dispatch('games/startGame', { axios: this.$axios, id })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .title-grid {
    display: grid;
    grid-template-columns: 1fr repeat(3, max-content);
    grid-column-gap: 2px;
    margin-bottom: 5px;
  }

  .game-title {
    font-size: 1.5rem;
    line-height: 36px;
  }

  .border-bottom {
    border-bottom: 1px solid $black;
  }

  .user {
    margin-right: 2px;
  }

  .list-title {
    width: 65px;
    display: inline-flex;
  }
</style>
