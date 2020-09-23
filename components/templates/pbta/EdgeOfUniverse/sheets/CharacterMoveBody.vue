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
          path="moves"
        />
      </div>
    </details>
    <details class="moves" open>
      <summary class="moves-title">Ходы роли</summary>
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
          path="moves"
        />
      </div>
    </details>
    <details class="moves">
      <summary class="moves-title">Космические ходы</summary>
      <div class="moves-grid">
        <move
          v-for="(move, index) in spaceMoves"
          :key="`space-moves-${index}`"
          :sheet="sheet"
          :move="move"
          :index="index"
          path="moves"
        />
      </div>
    </details>

    <add-move-modal
      v-if="specialMovesOpen"
      :id="id"
      :obj="specialMoveObj"
      @completed="value => specialMoveObj = value"
    />
    <add-world-move-modal
      v-if="otherMovesOpen"
      :id="id"
      :obj="otherMoveObj"
      @completed="value => otherMoveObj = value"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Pbta } from '@/lib/Pbta'
import Move from '@/components/templates/pbta/EdgeOfUniverse/components/Move'
import AddMoveModal from '@/components/templates/pbta/EdgeOfUniverse/modals/AddMoveModal'
import AddWorldMoveModal from '@/components/templates/pbta/EdgeOfUniverse/modals/AddWorldMoveModal'

export default {
  name: 'CharacterMoveBody',

  components: { AddWorldMoveModal, AddMoveModal, Move },

  props: {
    id: { type: String, required: true },
  },

  data() {
    return {
      panels: [],
      specialMovesOpen: false,
      otherMovesOpen: false,
      items: [
        { text: 'Добавить специальный ход', value: 'special', callback: () => this.add('special') },
        { text: 'Добавить мировой ход', value: 'other', callback: () => this.add('other') },
        { text: 'Добавить свой ход', value: 'self', callback: () => this.add('self') },
      ],
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

    spaceMoves: {
      get() {
        return this.tables.spaceMoves
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

.actions {
  display: grid;
  grid-template-columns: max-content 10px max-content;
  justify-content: center;
  margin-top: 15px;
  margin-bottom: 5px;
}
</style>
