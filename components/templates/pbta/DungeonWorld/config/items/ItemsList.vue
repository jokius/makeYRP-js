<template>
  <div class="grid">
    <div class="actions">
      <v-btn
        color="indigo"
        dark
        @click="showModal({ remove: true })"
      >
        Новый предмет
      </v-btn>

      <v-btn color="indigo" dark @click="save">
        Сохранить
      </v-btn>
    </div>
    <details v-for="(type, index) in types" :key="`type-${index}`" class="items">
      <summary class="types-title">{{ type }}</summary>
      <div class="actions">
        <v-btn color="indigo" dark @click="showModal({ remove: true, type: type })">
          <span>Новый предмет</span>
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
          <tr v-for="(obj, index) in itemsByType(type)" :key="`item-${index}`">
            <td>{{ obj.name }}</td>
            <td class="actions cell">
              <v-btn color="indigo" dark @click="showModal({ ...obj, restore: true, type: type })">
                <span>Изменить</span>
              </v-btn>
              <v-btn
                v-if="obj.remove || obj.restore"
                color="red darken-4"
                fab
                x-small
                dark
                @click="removeItem(customItemIndex(obj))"
              >
                <v-icon v-if="obj.remove">mdi-delete</v-icon>
                <v-icon v-else>mdi-restore</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </details>

    <item-modal v-if="modalOpen" v-model="obj" :types="types" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { uniq, uniqBy } from 'lodash'

  import ItemModal from './ItemModal'

  export default {
    name: 'ItemsList',

    components: { ItemModal },

    data() {
      return {
        modalOpen: false,
        item: {},
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

      types() {
        return uniq(this.items.map(item => item.type))
      },

      items() {
        const list = this.customTables.items.slice()
        return uniqBy(list.concat(this.tables.items.slice()), item => item.name)
      },

      obj: {
        get() {
          return { open: this.modalOpen, item: this.item }
        },

        set({ open, item, isClose }) {
          if (!isClose) this.changeItem(item)

          this.modalOpen = open
        },
      },
    },

    created() {
      if (!this.customTables) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables`, value: {} })
      }

      if (!this.customTables.items) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.items`, value: [] })
      }
    },

    methods: {
      itemsByType(type) {
        return this.items.filter(item => item.type === type)
      },

      customItemIndex(item) {
        return this.customTables.items.findIndex(obj => obj.name === item.name)
      },

      showModal(item) {
        this.item = item
        this.modalOpen = open
      },

      changeItem(item) {
        const items = this.customTables.items.slice()
        const oldItemIndex = items.findIndex(obj => obj.name === item.name)

        if (oldItemIndex >= 0) {
          items[oldItemIndex] = item
        } else {
          items.push(item)
        }

        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.items`, value: items })
      },

      removeItem(index) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.items`, value: index, remove: true })
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
    grid-template-columns: repeat(2, max-content);
    grid-column-gap: 5px;
    justify-content: center;
    margin-top: 5px;
  }

  .types-title {
    font-size: 16px;
    font-weight: bold;
  }

  .item-grid {
    padding-top: 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid $black;
  }
</style>
