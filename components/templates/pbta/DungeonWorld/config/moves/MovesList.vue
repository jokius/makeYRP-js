<template>
  <div class="grid">
    <details class="moves" open>
      <summary class="moves-title">Базовые ходы</summary>
      <div class="actions">
        <v-btn color="indigo" dark @click="showModal({ remove: true }, 'baseMoves')">
          <span>Новый ход</span>
        </v-btn>

        <v-btn color="indigo" dark @click="save">
          <span>Сохранить</span>
        </v-btn>
      </div>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">Название</th>
            <th class="text-left" />
          </tr>
          </thead>
          <tbody>
          <tr v-for="(move, index) in baseMoves" :key="`base-move-${index}`">
            <td>{{ move.name }}</td>
            <td class="actions cell">
              <v-btn color="indigo" dark @click="showModal({ ...move, restore: true }, 'baseMoves')">
                <span>Изменить</span>
              </v-btn>
              <v-btn
                v-if="move.remove || move.restore"
                color="red darken-4"
                fab
                x-small
                dark
                @click="removeMove(customMoveIndex(move, 'baseMoves'), 'baseMoves')"
              >
                <v-icon v-if="move.remove">mdi-delete</v-icon>
                <v-icon v-else>mdi-restore</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </details>
    <details class="moves" open>
      <summary class="moves-title">Особые ходы</summary>
      <div class="actions">
        <v-btn color="indigo" dark @click="showModal({ remove: true }, 'optionalMoves')">
          <span>Новый ход</span>
        </v-btn>

        <v-btn color="indigo" dark @click="save">
          <span>Сохранить</span>
        </v-btn>
      </div>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">Название</th>
            <th class="text-left" />
          </tr>
          </thead>
          <tbody>
          <tr v-for="(move, index) in optionalMoves" :key="`optional-move-${index}`">
            <td>{{ move.name }}</td>
            <td class="actions cell">
              <v-btn color="indigo" dark @click="showModal({ ...move, restore: true }, 'optionalMoves')">
                <span>Изменить</span>
              </v-btn>
              <v-btn
                v-if="move.remove || move.restore"
                color="red darken-4"
                fab
                x-small
                dark
                @click="removeMove(customMoveIndex(move, 'optionalMoves'), 'optionalMoves')"
              >
                <v-icon v-if="move.remove">mdi-delete</v-icon>
                <v-icon v-else>mdi-restore</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </details>
    <details class="moves" open>
      <summary class="moves-title">Ходы смерти</summary>
      <div class="actions">
        <v-btn color="indigo" dark @click="showModal({ remove: true }, 'deathMoves.all')">
          <span>Новый ход</span>
        </v-btn>

        <v-btn color="indigo" dark @click="save">
          <span>Сохранить</span>
        </v-btn>
      </div>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">Название</th>
            <th class="text-left" />
          </tr>
          </thead>
          <tbody>
          <tr v-for="(move, index) in deathMoves" :key="`death-move-${index}`">
            <td>{{ move.name }}</td>
            <td class="actions cell">
              <v-btn color="indigo" dark @click="showModal({ ...move, restore: true }, 'deathMoves.all')">
                <span>Изменить</span>
              </v-btn>
              <v-btn
                v-if="move.remove || move.restore"
                color="red darken-4"
                fab
                x-small
                dark
                @click="removeMove(customMoveIndex(move, 'deathMoves.all'), 'deathMoves.all')"
              >
                <v-icon v-if="move.remove">mdi-delete</v-icon>
                <v-icon v-else>mdi-restore</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </details>

    <move-modal v-if="modalOpen" v-model="obj" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { uniqBy, get } from 'lodash'
  import MoveModal from './MoveModal'

  export default {
    name: 'MovesList',

    components: { MoveModal },

    data() {
      return {
        modalOpen: false,
        move: {},
      }
    },

    computed: {
      ...mapState({
        game: state => state.gameConfig.info,
      }),

      tables() {
        return this.game.template.tables
      },

      customTables() {
        return this.game.customTemplate.tables
      },

      baseMoves() {
        const list = this.customTables.baseMoves.slice()

        return uniqBy(list.concat(this.tables.baseMoves.slice()), item => item.name)
      },

      optionalMoves() {
        const list = this.customTables.optionalMoves.slice()

        return uniqBy(list.concat(this.tables.optionalMoves.slice()), item => item.name)
      },

      deathMoves() {
        const list = this.customTables.deathMoves.all.slice()

        return uniqBy(list.concat(this.tables.deathMoves.all.slice()), item => item.name)
      },

      obj: {
        get() {
          return { open: this.modalOpen, move: this.move }
        },

        set({ open, move, isClose }) {
          if (!isClose) this.changeMove(move)

          this.modalOpen = open
        },
      },
    },

    created() {
      if (!this.customTables) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables`, value: {} })
      }

      if (!this.customTables.baseMoves) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.baseMoves`, value: [] })
      }

      if (!this.customTables.optionalMoves) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.optionalMoves`, value: [] })
      }

      if (!this.customTables.deathMoves) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.deathMoves`, value: {} })
      }

      if (!this.customTables.deathMoves.all) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.deathMoves.all`, value: [] })
      }
    },

    methods: {
      showModal(move, group) {
        this.move = move
        this.group = group
        this.modalOpen = open
      },

      changeMove(move) {
        const moves = get(this.customTables, this.group).slice()
        const oldMoveIndex = moves.findIndex(item => item.name === move.name)

        if (oldMoveIndex >= 0) {
          moves[oldMoveIndex] = move
        } else {
          moves.push(move)
        }

        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.${this.group}`, value: moves })
      },

      customMoveIndex(move, group) {
        return get(this.customTables, group).findIndex(item => item.name === move.name)
      },

      removeMove(index, group) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.${group}`, value: index, remove: true })
      },

      save() {
        this.$store.dispatch('gameConfig/update', { axios: this.$axios, params: this.game.params })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    grid-row-gap: 5px;
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
  }

  .actions {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-column-gap: 5px;
    justify-content: center;
    margin-top: 5px;

    &.cell {
      justify-content: normal;
    }
  }
</style>
