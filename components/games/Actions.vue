<template>
  <div class="text-center">
    <v-btn
      tile
      color="indigo"
      dark
      :href="createGame"
    >
      Создать игру
    </v-btn>
    <v-btn
      v-if="user.admin"
      tile
      color="indigo"
      dark
      :href="newSystem"
    >
      Добавить систему
    </v-btn>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'Actions',
    data: () => ({
      newSystem: '/systems/new',
      createGame: '/games/new',
    }),

    computed: {
      ...mapState({
        user: state => state.auth.user,
      }),
    },
  }
</script>
