<template>
  <pre>
    <code class="json">
      {{ game.customTemplate }}
    </code>
  </pre>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'JsonResult',

    computed: {
      ...mapState({
        game: state => state.gameConfig.info,
      }),
    },
  }
</script>

<style scoped lang="scss">
  .json {
    background-color: white;
    color: black;
  }
</style>
