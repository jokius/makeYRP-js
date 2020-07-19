<template>
  <div class="users">
    <div
      v-for="user in users"
      :key="user.id"
      :class="[{ pointer: currentUser.id === user.id }, 'user-grid']"
      @click="openSelect(user)"
    >
      <v-avatar size="72" color="indigo">
        <img
          :src="src(user)"
          :alt="user.nickname"
        />
      </v-avatar>
      <div class="name">{{ name(user) }}</div>
    </div>

    <select-sheet-modal v-model="obj" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import SelectSheetModal from './SelectSheetModal'

  export default {
    name: 'Users',

    components: { SelectSheetModal },

    data() {
      return {
        modalOpen: false,
      }
    },

    computed: {
      ...mapState({
        users: state => state.game.users,
        currentUser: state => state.auth.user,
      }),

      obj: {
        get() {
          return { open: this.modalOpen }
        },

        set({ open, sheet, isClose }) {
          this.modalOpen = open
          if (isClose) return

          this.$cable.perform({
            channel: 'GameChannel',
            action: 'change',
            data: {
              sheet,
              type: 'user',
            },
          })
        },
      },
    },

    methods: {
      openSelect(user) {
        if (this.currentUser.id !== user.id) return

        this.modalOpen = true
      },

      src(user) {
        return user.sheet.id ? user.sheet.imgThumb : user.imgThumb
      },

      name(user) {
        return user.sheet.id ? user.sheet.name : user.nickname
      },
    },
  }
</script>

<style scoped lang="scss">
  .users {
    display: flex;
    position: absolute;
    z-index: 2;
    left: 10px;
    bottom: 40px;
  }

  .user-grid {
    display: grid;
    margin-right: 5px;
    grid-template-rows: repeat(2, max-content);
  }

  .name {
    margin-top: 5px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    text-align: center;
    word-break: break-word;
    width: 72px;
  }

  .pointer {
    cursor: pointer;
  }
</style>
