<template>
  <div class="list">
    <sheet-item v-for="sheet in sheets" :key="sheet.id" :sheet="sheet" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import SheetItem from '@/components/games/show/sheets/SheetItem'

  export default {
    name: 'SheetsList',

    components: { SheetItem },

    computed: {
      ...mapState({
        sheets: state => state.game.sheets,
      }),
    },
  }
</script>

<style scoped lang="scss">
.list {
  display: grid;
  grid-row-gap: 2px;
}
</style>
