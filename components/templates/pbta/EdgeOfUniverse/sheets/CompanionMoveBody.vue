<template>
  <div class="moves-body">
    <div class="moves-grid">
      <move
        v-for="(move, index) in baseMoves"
        :key="`base-moves-${index}`"
        :sheet="sheet"
        :move="move"
        :index="index"
        path="moves"
      />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import Move from '../components/Move'

  export default {
    name: 'CompanionMoveBody',
    components: { Move },
    props: {
      id: { type: String, required: true },
    },

    computed: {
      ...mapState({
        sheets: state => state.game.sheets,
        tables: state => state.game.info.template.tables,
      }),

      sheet: {
        get() {
          return this.sheets.find(sheet => sheet.id === this.id)
        },
      },

      params: {
        get() {
          return this.sheet.params
        },
      },

      baseMoves: {
        get() {
          return this.tables.baseMoves
        },
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .moves-body {
    background-color: $grayC5;
    overflow: auto;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: max-content;
    padding: 0 5px;
    margin-top: 5px;
  }

  .moves-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 15px;
  }
</style>
