<template>
  <v-dialog :value="obj.open" persistent fullscreen>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или Изменить ходы класс
      </v-card-title>
      <div class="actions">
        <v-btn color="indigo" dark @click="showModal({ remove: true })">
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
          <tr v-for="(move, index) in moves" :key="`move-${index}`">
            <td>{{ move.name }}</td>
            <td class="actions cell">
              <v-btn
                color="indigo"
                dark
                @click="showModal({ ...move, restore: true })"
              >
                <span>Изменить</span>
              </v-btn>
              <v-btn
                v-if="move.remove || move.restore"
                color="red darken-4"
                fab
                x-small
                dark
                @click="removeMove(index)"
              >
                <v-icon v-if="move.remove">mdi-delete</v-icon>
                <v-icon v-else>mdi-restore</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>

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
import MoveModal from '~/components/templates/pbta/ApocalypseWorld/config/moves/MoveModal'

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

    moves() {
      const list = this.customTables.moves[this.roleKey].slice()

      return uniqBy(list.concat((this.tables.moves[this.roleKey] || []).slice()), item => item.name)
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
    if (!this.customTables.moves) {
      this.$store.commit('gameConfig/update', { path: `customTemplate.tables.moves`, value: {} })
    }

    if (!this.customTables.moves[this.roleKey]) {
      this.$store.commit('gameConfig/update',
        { path: `customTemplate.tables.moves.${this.roleKey}`, value: [] })
    }
  },

  methods: {
    showModal(move) {
      this.move = move
      this.modalOpen = open
    },

    changeMove(move) {
      const moves = this.moves.slice()
      const oldMoveIndex = moves.findIndex(item => item.name === move.name)

      if (oldMoveIndex >= 0) {
        moves[oldMoveIndex] = move
      } else {
        moves.push(move)
      }

      this.$store.commit('gameConfig/update',
        { path: `customTemplate.tables.moves.${this.roleKey}`, value: moves })
    },

    removeMove(index) {
      this.$store.commit('gameConfig/update',
        { path: `customTemplate.tables.moves.${this.roleKey}`, value: index, remove: true })
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
