<template>
  <v-app id="inspire">
    <client-only>
      <v-main v-if="loaded">
        <left-menu />
        <div class="menu-grid">
          <head-menu class="head-menu" />
          <body-menu class="body-menu" />
          <body-content class="body-content" :size="bodySize" />
        </div>
        <open-modals />
      </v-main>
      <loader v-else />

      <v-overlay :value="overlay">
        <v-card>
          <v-card-text class="disconnect-message">
            <h1>Соединение с сервером потерено</h1>
            <p>Обновите страницу либо подождите востонавления соеденения</p>
          </v-card-text>
        </v-card>
      </v-overlay>
    </client-only>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex'
  import LeftMenu from '../../components/games/show/LeftMenu'
  import HeadMenu from '../../components/games/show/HeadMenu'
  import BodyMenu from '../../components/games/show/BodyMenu'
  import BodyContent from '../../components/games/show/BodyContent'
  import OpenModals from '../../components/games/show/OpenModals'
  import Loader from '../../components/Loader'

  export default {
    name: 'ShowGame',
    components: { Loader, OpenModals, BodyContent, BodyMenu, HeadMenu, LeftMenu },
    data() {
      return {
        overlay: false,
      }
    },

    channels: {
      GameChannel: {
        connected() {
          this.overlay = false
        },
        disconnected() {
          this.overlay = true
        },

        received(obj) {
          if (obj.new) this.addObj(obj)
          if (obj.update) this.updateObj(obj)
          if (obj.delete) this.deleteObj(obj)
          if (obj.access) this.accessObj(obj)
        },
      },

      SheetChannel: {
        received(obj) {
          if (obj.delete) {
            this.$cable.unsubscribe('SheetChannel')
            this.onClose()
            this.$store.commit('game/deleteSheet', obj.delete)
          } else {
            this.$store.commit('game/updateSheet', obj)
          }
        },
      },
    },

    computed: {
      ...mapState({
        game: state => state.game,
        marks: state => state.game.marks,
        user: state => state.auth.user,
        auth: state => state.auth,
      }),

      loaded() {
        return this.game.loaded
      },

      bodySize: {
        get() {
          return 0
        }
      },
    },

    created() {
      this.$store.dispatch('game/load', { axios: this.$axios, id: this.$route.params.id, user: this.user })
    },

    mounted() {
      this.$cable.connection.connect(`${process.env.wsUrl}?token=${this.$auth.getToken('local')}`)
      const gameId = this.$route.params.id

      this.$cable.subscribe({
        channel: 'GameChannel',
        game_id: gameId,
      })

      document.addEventListener('keydown', e => this.setAltPressed(e))
      document.addEventListener('keyup', e => this.setAltPressed(e))
    },

    destroyed() {
      document.removeEventListener('keydown', e => this.setAltPressed(e))
      document.removeEventListener('keyup', e => this.setAltPressed(e))
    },

    methods: {
      addObj(obj) {
        if (obj.sheet) this.$store.commit('game/addSheet', { user: this.user, raw: obj.sheet })
        if (obj.page) this.$store.commit('game/addPage', obj.page)
        if (obj.menu_item) this.$store.commit('game/addMenuItem', obj.menu_item)
        if (obj.message) this.addMessage(obj.message)
      },

      updateObj(obj) {
        if (obj.sheet) this.$store.commit('game/updateSheets', obj.sheet)
        if (obj.page) this.$store.commit('game/updatePage', obj.page)
        if (obj.menu_item) this.$store.commit('game/updateMenuItem', obj.menu_item)
      },

      deleteObj(obj) {
        if (obj.sheet) this.$store.commit('game/deleteSheet', obj.sheet)
        if (obj.page) this.$store.commit('game/deletePage', obj.page)
        if (obj.menu_item) this.$store.commit('game/deleteMenuItem', obj)
      },

      accessObj(obj) {
        if (obj.sheet) this.$store.commit('game/accessSheet', { user: this.user, raw: obj.sheet })
      },

      addMessage(message) {
        this.$store.commit('game/addMessage', message)
        const audio = new Audio('/sounds/intuition.mp3')
        audio.play()
      },

      setAltPressed(e) {
        this.$store.commit('game/altIsPressed', e.altKey)
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .disconnect-message {
    text-align: center;

    h1 {
      font-size: 2em;
    }
  }

  .menu-grid {
    display: grid;
    grid-template-columns: auto auto max-content;
    grid-template-rows: 57px auto;
    grid-gap: 0;
    position: fixed;
    width: 100vw;
    height: 100vh;
    grid-template-areas: 'head-menu head-menu body-menu' 'body-content body-content body-menu';
  }

  .head-menu {
    grid-area: head-menu;
    position: relative;
    z-index: 2;
    background-color: $white;
  }

  .body-menu {
    grid-area: body-menu;
    position: relative;
    z-index: 2;
  }

  .left-menu {
    position: absolute;
    z-index: 2;
  }

  .body-content {
    grid-area: body-content;
    position: relative;
    z-index: 1;
  }
</style>
