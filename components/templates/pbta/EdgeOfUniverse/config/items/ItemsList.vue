<template>
  <div class="grid">
    <div class="actions">
      <v-btn
        color="indigo"
        dark
        @click="showModal({})"
      >
        Новый предмет
      </v-btn>

      <v-btn color="indigo" dark @click="save">
        Сохранить
      </v-btn>
    </div>
    <details v-for="(type, index) in types" :key="`type-${index}`" class="items">
      <summary class="types-title">{{ type }}</summary>
      <v-list>
        <div v-for="(obj, index) in itemsByType(type)" :key="`item-${index}`" class="item-grid">
          <div>Категория: {{ obj.type }}</div>
          <div>Уровень: {{ obj.level }}</div>
          <div>Название: {{ obj.name }}</div>
          <div v-if="typeof obj.damage !== 'undefined'">Урон: {{ obj.damage }}</div>
          <div v-if="typeof obj.protection !== 'undefined'">Защита: {{ obj.protection }}</div>
          <div>Описание: {{ obj.description }}</div>
          <div>Теги: {{ obj.tags.join(', ') }}</div>
          <div class="actions">
            <v-btn
              color="indigo"
              dark
              @click="showModal(obj)"
            >
              Изменить предмет
            </v-btn>

            <v-btn
              v-if="customItemIndex(obj) >= 0"
              color="indigo"
              dark
              @click="removeItem(customItemIndex(obj))"
            >
              Удалить предмет
            </v-btn>
          </div>
        </div>
      </v-list>
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

      template() {
        return this.game.template.tables
      },

      customTemplate() {
        return this.game.customTemplate.tables
      },

      types() {
        return uniq(this.items.map(item => item.type))
      },

      items() {
        const list = this.customTemplate.items.slice()
        return uniqBy(list.concat(this.template.items.slice()), item => item.name)
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
      if (!this.customTemplate.items) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.items`, value: [] })
      }
    },

    methods: {
      itemsByType(type) {
        return this.items.filter(item => item.type === type)
      },

      customItemIndex(item) {
        return this.customTemplate.items.findIndex(obj => obj.name === item.name)
      },

      showModal(item) {
        this.item = item
        this.modalOpen = open
      },

      changeItem(item) {
        const items = this.customTemplate.items.slice()
        const oldItemIndex = items.findIndex(obj => obj.name === item.name)

        if (oldItemIndex >= 0) {
          items[oldItemIndex] = item
        } else {
          items.push(item)
        }

        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.items`, value: items })
      },

      removeItem(index) {
        this.$store.commit('gameConfig/update',
          { path: `customTemplate.tables.items`, value: index, remove: true })
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
