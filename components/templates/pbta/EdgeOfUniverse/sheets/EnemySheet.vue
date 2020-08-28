<template>
  <div v-if="canWrite" class="sheet-body" :style="{ width, height }">
    <enemy-main-body :id="id" />
  </div>
  <div v-else class="sheet-body" :style="{ width, height }">
    <character-read-only :id="id" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import EnemyMainBody from './EnemyMainBody'
  import CharacterReadOnly from './CharacterReadOnly'

  export default {
    name: 'EnemySheet',
    components: { CharacterReadOnly, EnemyMainBody },
    props: {
      id: { type: String, required: true },
      size: { type: Object, required: true },
    },

    computed: {
      ...mapState({
        sheets: state => state.game.sheets,
      }),

      sheet: {
        get() {
          return this.sheets.find(sheet => sheet.id === this.id)
        },
      },

      canWrite: {
        get() {
          return this.sheet.acl.canWrite
        },
      },

      width: {
        get() {
          const width = this.size.width
          return typeof width === 'number' ? `${width}px` : width
        },
      },

      height: {
        get() {
          const height = this.size.height
          return typeof height === 'number' ? `${height}px` : height
        },
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .sheet-body {
    background-color: $grayC5;
    overflow: auto;
  }
</style>
