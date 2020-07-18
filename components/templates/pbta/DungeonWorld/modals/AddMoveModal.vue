<template>
  <v-dialog :value="obj.open" max-width="600" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Выбрать ход
      </v-card-title>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-select
              v-model="group"
              :items="movesGroups"
              color="indigo"
              label="Группа"
            />
            <v-select
              v-model="move"
              :items="selectMoves"
              color="indigo"
              label="Ход"
            />
          </v-col>
          <v-col cols="12">
            <span v-html="move.description" />
          </v-col>
        </v-row>
      </v-container>

      <v-divider />

      <v-card-actions>
        <v-btn
          dark
          color="indigo"
          @click="close"
        >
          Закрыть
        </v-btn>
        <v-spacer />
        <v-btn
          dark
          :disabled="!move.name"
          color="indigo"
          @click="add"
        >
          Добавить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex'
  import { Pbta } from '../../../../../lib/Pbta'

  export default {
    name: 'AddMoveModal',

    model: {
      prop: 'obj',
      event: 'completed',
    },

    props: {
      obj: { type: Object, required: true },
      id: { type: Number, required: true },
    },

    data() {
      return {
        move: {},
        privateGroup: null,
      }
    },

    computed: {
      ...mapState({
        sheets: state => state.game.sheets,
        tables: state => state.game.info.template.tables,
      }),

      sheet() {
        return this.sheets.find(sheet => sheet.id === this.id)
      },

      params() {
        return this.sheet.params
      },

      moves() {
        return this.params.moves
      },

      role() {
        return this.params.role.key
      },

      movesGroups() {
        return this.tables.movesGroups.filter(item => {
          const group = this.tables.specialMoves[this.role][item.value] || []
          return group.length > 0
        })
      },

      group: {
        get() {
          return this.privateGroup || this.movesGroups[0].value
        },

        set(value) {
          this.privateGroup = value
        }
      },

      selectMoves() {
        return Pbta.mapMoves(this.tables.specialMoves[this.role][this.group], this.moves)
      }
    },

    methods: {
      add() {
        this.$emit('completed', { open: false, move: this.move })
        this.move = {}
      },

      close() {
        this.$emit('completed', { open: false, move: {} })
        this.move = {}
      },
    },
  }
</script>
