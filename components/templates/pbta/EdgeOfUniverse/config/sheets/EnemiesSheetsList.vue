<template>
  <div class="grid">
    <div class="actions">
      <v-btn color="indigo" dark @click="showModal({ ...emptyEnemy })">
        <span>Новый противник</span>
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
        <tr v-for="(enemy, index) in enemies" :key="`enemies-${index}`">
          <td>{{ enemy.name }}</td>
          <td class="actions cell">
            <v-btn color="indigo" dark @click="showModal({ ...enemy, restore: true })">
              <span>Изменить</span>
            </v-btn>
            <v-btn
              v-if="enemy.remove || enemy.restore"
              color="red darken-4"
              fab
              x-small
              dark
              @click="removeEnemy(enemy)"
            >
              <v-icon v-if="enemy.remove">mdi-delete</v-icon>
              <v-icon v-else>mdi-restore</v-icon>
            </v-btn>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>

    <enemy-modal v-if="modalOpen" v-model="obj" :enemies="enemies" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { uniqBy } from 'lodash'
  import EnemyModal from '@/components/templates/pbta/EdgeOfUniverse/config/sheets/EnemyModal'

  export default {
    name: 'EnemiesSheetsList',

    components: { EnemyModal },

    data() {
      return {
        modalOpen: false,
        avatarModalOpen: false,
        enemy: {},
        emptyEnemy: {
          name: null,
          description: null,
          damage: null,
          protection: null,
          woundsMax: null,
          moves: [],
        },
        loading: false,
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

      enemies() {
        const list = this.customTables.enemies.slice()

        return uniqBy(list.concat(this.tables.enemies.slice()), item => item.name)
      },

      obj: {
        get() {
          return { open: this.modalOpen, enemy: this.enemy }
        },

        set({ open, enemy, isClose }) {
          if (!isClose) this.changeEnemy(enemy)

          this.modalOpen = open
        },
      },

      avatarObj: {
        get() {
          return { open: this.avatarModalOpen, enemy: this.enemy }
        },

        set({ open, enemy, isClose }) {
          if (!isClose) this.changeEnemy(enemy)

          this.avatarModalOpen = open
        },
      },
    },

    created() {
      if (!this.customTables) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables`, value: {} })
      }

      if (!this.customTables.enemies) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.enemies`, value: [] })
      }
    },

    methods: {
      showModal(enemy) {
        this.enemy = enemy
        this.modalOpen = true
      },

      changeEnemy(enemy) {
        const enemies = this.customTables.enemies.slice()
        const oldEnemyIndex = enemies.findIndex(item => item.name === enemy.name)

        if (oldEnemyIndex >= 0) {
          enemies[oldEnemyIndex] = enemy
        } else {
          enemies.push(enemy)
        }

        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.enemies`, value: enemies })
      },


      removeEnemy(enemy) {
        const index = this.customTables.enemies.findIndex(item => item.name === enemy.name)
        if (index < 0) return

        this.$store.commit('gameConfig/update', { path: 'customTemplate.tables.enemies', value: index, remove: true })
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

  .actions {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-column-gap: 5px;
    justify-content: center;
    margin-top: 5px;

    &.cell {
      grid-template-columns: repeat(6, max-content);
      justify-content: normal;
    }
  }

  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
