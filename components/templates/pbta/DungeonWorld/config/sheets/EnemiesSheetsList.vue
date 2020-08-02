<template>
  <div class="grid">
    <div class="actions">
      <v-btn color="indigo" dark @click="showModal(emptyEnemy)">
        <span>Новый противник</span>
      </v-btn>

      <v-btn color="indigo" dark @click="save">
        <span>Сохранить</span>
      </v-btn>

      <v-btn color="indigo" dark :loading="loading" :disabled="loading" @click="download">
        <span>Скачать аватарки</span>
      </v-btn>
    </div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
        <tr>
          <th />
          <th class="text-left">Название</th>
          <th class="text-left">Ключ</th>
          <th class="text-left" />
        </tr>
        </thead>
        <tbody>
        <tr v-for="enemy in enemies" :key="`enemies-${enemy.key}`">
          <v-avatar tile color="indigo" size="50" class="avatar">
            <v-img
              :src="avatar(enemy)"
            />
          </v-avatar>
          <td>{{ enemy.name }}</td>
          <td class="actions cell">
            <v-btn color="indigo" dark @click="showModal({ ...enemy, restore: true })">
              <span>Изменить</span>
            </v-btn>
            <v-btn color="indigo" dark @click="showAvatarModal({ ...enemy, restore: true })">
              <span>Аватарка</span>
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
    <enemy-avatar-modal v-if="avatarModalOpen" v-model="avatarObj" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { get, uniqBy } from 'lodash'
  import EnemyModal from './EnemyModal'
  import EnemyAvatarModal from './EnemyAvatarModal'
  import { downloadList } from '@/api/media'

  export default {
    name: 'EnemiesSheetsList',

    components: { EnemyAvatarModal, EnemyModal },

    data() {
      return {
        modalOpen: false,
        avatarModalOpen: false,
        enemy: {},
        emptyEnemy: {
          name: null,
          hp: {
            max: null,
            current: null,
          },
          description: null,
          damage: null,
          damageName: null,
          damageTags: [],
          protection: null,
          special: null,
          instinct: null,
          tags: [],
          moves: [],
          remove: true,
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
      avatar(enemy) {
        return get(enemy.img, 'versions.chat', '/images/default/blank_char_50.png')
      },

      showModal(enemy) {
        this.enemy = enemy
        this.modalOpen = true
      },

      showAvatarModal(enemy) {
        this.enemy = enemy
        this.avatarModalOpen = true
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

      download() {
        this.loading = true
        const keys = this.enemies.map(item => {
          const path = item.img.versions?.url
          if (!path) return

          const arr = path.split('/')
          return arr[arr.length - 1]
        }).filter(Boolean)

        downloadList(this.$axios, keys).then(() => this.loading = false)
      }
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
</style>
