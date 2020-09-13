<template>
  <div class="grid">
    <v-text-field
      v-model="search"
      color="indigo"
      class="search"
      flat
      hide-details
      single-line
      placeholder="поиск..."
      prepend-inner-icon="mdi-magnify"
    />
    <v-treeview
      v-model="tree"
      :open="open"
      :items="items"
      item-key="name"
      item-text=""
      color="indigo"
      open-on-click
    >
      <template v-slot:prepend="{ item, open }">
        <div v-if="!item.id" class="item-grid">
          <v-icon>
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>

          <div class="item-name">
            {{ item.name }}
          </div>
        </div>
        <div v-else class="item-grid" @click="showModal(item.params)">
          <div class="item-name">
            {{ item.params.name }}
          </div>
          <div class="item-price">
            цена {{ item.params.price || 0 }}з.
          </div>
        </div>
      </template>
    </v-treeview>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import { uniq } from 'lodash'

  export default {
    name: 'DwTabItems',

    data() {
      return {
        openModal: false,
        types: [],
        open: [],
        tree: [],
        search: '',
      }
    },

    computed: {
      ...mapState({
        template: state => state.game.info.template
      }),

      items() {
        return this.types.map(type => {
          let children = this.template.tables.items
            .filter(item => item.type === type)

          if (this.search !== '') {
            children = children.filter(item => item.name.toLowerCase().includes(this.search.toLowerCase()))
          }
          children = children.map((item, index) => ({ id: index + 1, params: item }))
          return {
            name: type,
            children
          }
        })
      }
    },

    created() {
      this.types = uniq(this.template.tables.items.map(item => item.type))
      this.open = this.types.slice()
    },

    methods: {
      showModal(item) {
        const key = Date.now()
        this.$store.commit('game/addOpenModal', { name: 'dw-item', key, item })
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: max-content;
    grid-row-gap: 5px;
    height: 93vh;
    overflow: auto;
  }

  .selectButton {
    margin: 0;
    width: auto;
  }

  .item-grid {
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-column-gap: 5px;
  }

  .item-name {
    text-align: center;
    line-height: 32px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-price {
    text-align: center;
    line-height: 32px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .search {
    margin: 0;
    padding: 0;
  }
</style>
