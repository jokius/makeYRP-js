<template>
  <div class="grid">
    <v-treeview
      v-model="tree"
      :open="open"
      :items="items"
      activatable
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
          <div class="item-level">
            ур. {{ item.params.level }}
          </div>
        </div>
      </template>
    </v-treeview>
  </div>
</template>

<script>

  import { loadItems } from '../../../../../api/game'

  export default {
    name: 'EouTabItems',

    data() {
      return {
        openModal: false,
        open: [],
        tree: [],
        items: [],
      }
    },

    created() {
      this.loadItems()
    },

    methods: {
      loadItems() {
        loadItems({ axios: this.$axios, id: this.$route.params.id }).then(items => {
          this.open = items.map(item => item.name)
          this.items = items
        })
      },

      showModal(item) {
        const key = Date.now()
        this.$store.commit('game/addOpenModal', { name: 'item', key, item })
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

  .item-level {
    text-align: center;
    line-height: 32px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
