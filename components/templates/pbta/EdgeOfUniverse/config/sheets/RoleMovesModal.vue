<template>
  <v-dialog :value="obj.open" persistent fullscreen>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или Изменить ходы класс
      </v-card-title>
      <details class="moves" open>
        <summary class="moves-title">Стартовые ходы</summary>
        <div class="actions">
          <v-btn color="indigo" dark @click="showModal({ remove: true }, `startMoves.${roleKey}`)">
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
            <tr v-for="(move, index) in startMoves" :key="`start-move-${index}`">
              <td>{{ move.name }}</td>
              <td class="actions cell">
                <v-btn color="indigo" dark @click="showModal({ ...move, restore: true }, `startMoves.${roleKey}`)">
                  <span>Изменить</span>
                </v-btn>
                <v-btn
                  v-if="move.remove || move.restore"
                  color="red darken-4"
                  fab
                  x-small
                  dark
                  @click="removeMove(customMoveIndex(move, `startMoves.${roleKey}`), `startMoves.${roleKey}`)"
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
        <summary class="moves-title">Специальные ходы</summary>
        <div class="actions">
          <v-btn color="indigo" dark @click="showModal({ remove: true }, `specialMoves.${roleKey}`)">
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
            <tr v-for="(move, index) in specialMoves" :key="`special-move-${index}`">
              <td>{{ move.name }}</td>
              <td class="actions cell">
                <v-btn color="indigo" dark @click="showModal({ ...move, restore: true }, `specialMoves.${roleKey}`)">
                  <span>Изменить</span>
                </v-btn>
                <v-btn
                  v-if="move.remove || move.restore"
                  color="red darken-4"
                  fab
                  x-small
                  dark
                  @click="removeMove(customMoveIndex(move, `specialMoves.${roleKey}`), `specialMoves.${roleKey}`)"
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

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn
          dark
          color="indigo"
          @click="close"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>

    <move-modal v-if="modalOpen" v-model="moveObj" :role-key="roleKey" />
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { uniqBy } from 'lodash'
import MoveModal from '~/components/templates/pbta/EdgeOfUniverse/config/moves/MoveModal'

export default {
  name: 'RoleMovesModal',

  components: { MoveModal },

  model: {
    prop: 'obj',
    event: 'changeRole',
  },

  props: {
    obj: { type: Object, required: true },
    roleKey: { type: String, required: true },
  },

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

    startMoves() {
      const list = this.customTables.startMoves[this.roleKey].slice()

      return uniqBy(list.concat((this.tables.startMoves[this.roleKey] || []).slice()), item => item.name)
    },

    specialMoves() {
      const list = this.customTables.specialMoves[this.roleKey].slice()

      return uniqBy(list.concat((this.tables.specialMoves[this.roleKey] || []).slice()), item => item.name)
    },

    moveObj: {
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
    if (!this.customTables.startMoves) {
      this.$store.commit('gameConfig/update', { path: `customTemplate.tables.startMoves`, value: {} })
    }

    if (!this.customTables.startMoves[this.roleKey]) {
      this.$store.commit('gameConfig/update', { path: `customTemplate.tables.startMoves.${this.roleKey}`, value: [] })
    }

    if (!this.customTables.specialMoves) {
      this.$store.commit('gameConfig/update', { path: `customTemplate.tables.specialMoves`, value: {} })
    }

    if (!this.customTables.specialMoves[this.roleKey]) {
      this.$store.commit('gameConfig/update',
        { path: `customTemplate.tables.specialMoves.${this.roleKey}`, value: [] })
    }
  },

  methods: {
    showModal(move, group) {
      this.move = move
      this.group = group
      this.modalOpen = open
    },

    changeMove(move) {
      const moves = (this.customTables?.[this.group] || []).slice()
      const oldMoveIndex = moves.findIndex(item => item.name === move.name)

      if (oldMoveIndex >= 0) {
        moves[oldMoveIndex] = move
      } else {
        moves.push(move)
      }

      this.$store.commit('gameConfig/update', { path: `customTemplate.tables.${this.group}`, value: moves })
    },

    customMoveIndex(move, group) {
      return (this.customTables?.[group] || []).findIndex(item => item.name === move.name)
    },

    removeMove(index, group) {
      this.$store.commit('gameConfig/update', { path: `customTemplate.tables.${group}`, value: index, remove: true })
    },

    save() {
      this.$store.dispatch('gameConfig/update', { axios: this.$axios, params: this.game.params })
    },

    close() {
      this.$emit('changeRole', { open: false })
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
