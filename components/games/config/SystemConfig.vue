<template>
  <div class="main">
    <eou-select-template v-if="system === 'edge_of_universe'" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'SystemConfig',

    components: {
      EouSelectTemplate: () => import('../../templates/pbta/EdgeOfUniverse/config/SelectTemplate'),
    },

    computed: {
      ...mapState({
        game: state => state.gameConfig.info,
      }),

      system: {
        get() {
          return this.game.system
        },
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
