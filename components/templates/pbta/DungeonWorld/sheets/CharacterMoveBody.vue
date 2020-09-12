<template>
  <div class="moves-body">
    <v-overflow-btn
      :items="items"
      label="Добавить..."
      color="black"
      segmented
      item-color="black"
      hide-details
      @change="value => add(value)"
    />
    <details class="moves" open>
      <summary class="moves-title">Базовые ходы</summary>
      <div class="moves-grid">
        <move
          v-for="(move, index) in baseMoves"
          :key="`base-moves-${index}`"
          :sheet="sheet"
          :move="move"
          :index="index"
          path="baseMoves"
        />
      </div>
    </details>
    <details class="moves" open>
      <summary class="moves-title">Ходы класса</summary>
      <div class="moves-grid">
        <move
          v-for="(move, index) in moves"
          :key="`moves-${index}`"
          :sheet="sheet"
          :move="move"
          :index="index"
          path="moves"
        />
      </div>
    </details>
    <details class="moves">
      <summary class="moves-title">Опциональные ходы</summary>
      <div class="moves-grid">
        <move
          v-for="(move, index) in optionalMoves"
          :key="`optional-moves-${index}`"
          :sheet="sheet"
          :move="move"
          :index="index"
          path="optionalMoves"
        />
      </div>
    </details>

    <add-move-modal
      v-if="specialMovesOpen"
      :id="id"
      :obj="specialMoveObj"
      @completed="value => specialMoveObj = value"
    />
    <add-death-move-modal
      v-if="deathMovesOpen"
      :id="id"
      :obj="deathMoveObj"
      @completed="value => deathMoveObj = value"
    />
    <add-other-move-modal
      v-if="otherMovesOpen"
      :id="id"
      :obj="otherMoveObj"
      @completed="value => otherMoveObj = value"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Move from '../components/Move'
  import AddMoveModal from '../modals/AddMoveModal'
  import AddOtherMoveModal from '../modals/AddOtherMoveModal'
  import AddDeathMoveModal from '../modals/AddDeathMoveModal'
  import { Pbta } from '~/lib/Pbta'

  export default {
    name: 'CharacterMoveBody',
    components: { AddDeathMoveModal, AddOtherMoveModal, AddMoveModal, Move },

    props: {
      id: { type: String, required: true },
    },

    data() {
      return {
        panels: [],
        deathMovesOpen: false,
        specialMovesOpen: false,
        otherMovesOpen: false,
        items: [
          { text: 'Добавить ход смерти', value: 'death', callback: () => this.add('death') },
          { text: 'Добавить сложный ход', value: 'special', callback: () => this.add('special') },
          { text: 'Добавить ход другого класса', value: 'other', callback: () => this.add('other') },
          { text: 'Добавить свой ход', value: 'self', callback: () => this.add('self') },
        ]
      }
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

      moves: {
        get() {
          return this.params.moves
        },
      },

      optionalMoves: {
        get() {
          return this.tables.optionalMoves
        },
      },

      specialMoveObj: {
        get() {
          return { open: this.specialMovesOpen, move: {} }
        },

        set({ open, move }) {
          this.setMove(move)
          this.specialMovesOpen = open
        },
      },

      deathMoveObj: {
        get() {
          return { open: this.deathMovesOpen, move: {} }
        },

        set({ open, move }) {
          this.setMove(move)
          this.deathMovesOpen = open
        },
      },

      otherMoveObj: {
        get() {
          return { open: this.otherMovesOpen, move: {} }
        },

        set({ open, move }) {
          this.setMove(move)
          this.otherMovesOpen = open
        },
      },
    },

    methods: {
      add(type) {
        switch (type) {
          case 'death':
            this.deathMovesOpen = true
            break
          case 'special':
            this.specialMovesOpen = true
            break
          case 'other':
            this.otherMovesOpen = true
            break
          case 'self':
            this.setMove(Pbta.newMove())
            break
          default:
            break
        }
      },

      setMove(move) {
        if (!move.name) return

        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: `moves[${this.moves.length}]`,
                             value: move,
                           })

        this.saveSheet()
      },

      saveSheet() {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'change',
          data: { ...this.sheet, type: 'sheet' },
        })
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
  }

  .moves {
    cursor: pointer;
    margin-bottom: 5px;
  }

  .moves-title {
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }

  .moves-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 15px;
  }

  .gray {
    background-color: $grayC5;
  }
</style>
