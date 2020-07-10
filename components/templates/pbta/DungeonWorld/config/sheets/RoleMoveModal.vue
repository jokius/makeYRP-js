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

      <details v-for="group in movesGroups" :key="group.value" class="moves" open>
        <summary class="moves-title">Ходы {{ group.text }}</summary>
        <div class="actions">
          <v-btn
            color="indigo"
            dark
            @click="showModal({ remove: true }, `specialMoves.${roleKey}.${group.value}`)">
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
            <tr v-for="(move, index) in specialMoves(group.value)" :key="`special-move-${group.value}-${index}`">
              <td>{{ move.name }}</td>
              <td class="actions cell">
                <v-btn
                  color="indigo"
                  dark
                  @click="showModal({ ...move, restore: true }, `specialMoves.${roleKey}.${group.value}`)">
                  <span>Изменить</span>
                </v-btn>
                <v-btn
                  v-if="move.remove || move.restore"
                  color="red darken-4"
                  fab
                  x-small
                  dark
                  @click="removeMove(customMoveIndex(move,
                   `specialMoves.${roleKey}.${group.value}`),
                    `specialMoves.${roleKey}.${group.value}`)"
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
          <v-btn color="indigo" dark @click="showModal({ remove: true }, `deathMoves.${roleKey}`)">
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
                <v-btn color="indigo" dark @click="showModal({ ...move, restore: true }, `deathMoves.${roleKey}`)">
                  <span>Изменить</span>
                </v-btn>
                <v-btn
                  v-if="move.remove || move.restore"
                  color="red darken-4"
                  fab
                  x-small
                  dark
                  @click="removeMove(customMoveIndex(move, `deathMoves.${roleKey}`), `deathMoves.${roleKey}`)"
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

    <move-modal v-if="modalOpen" v-model="moveObj" />
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex'
  import { uniqBy, get } from 'lodash'
  import MoveModal from '../moves/MoveModal'

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

      movesGroups() {
        return this.tables.movesGroups
      },

      startMoves() {
        const list = this.customTables.startMoves[this.roleKey].slice()

        return uniqBy(list.concat((this.tables.startMoves[this.roleKey] || []).slice()), item => item.name)
      },

      deathMoves() {
        const list = this.customTables.deathMoves[this.roleKey].slice()

        return uniqBy(list.concat((this.tables.deathMoves[this.roleKey] || []).slice()), item => item.name)
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
          { path: `customTemplate.tables.specialMoves.${this.roleKey}`, value: {} })
      }

      this.movesGroups.forEach(group => {
        if (!this.customTables.specialMoves[this.roleKey][group.value]) {
          this.$store.commit('gameConfig/update',
            { path: `customTemplate.tables.specialMoves.${this.roleKey}.${group.value}`, value: [] })
        }
      })

      if (!this.customTables.deathMoves) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.deathMoves`, value: {} })
      }

      if (!this.customTables.deathMoves[this.roleKey]) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.deathMoves.${this.roleKey}`, value: [] })
      }
    },

    methods: {
      specialMoves(groupKey) {
        const list = this.customTables.specialMoves[this.roleKey][groupKey].slice()

        const specialMoves = this.tables.specialMoves[this.roleKey] || {}
        return uniqBy(list.concat((specialMoves[groupKey] || []).slice()), item => item.name)
      },

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
