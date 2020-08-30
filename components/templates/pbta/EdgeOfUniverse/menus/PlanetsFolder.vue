<template>
  <div v-if="showFolder" :style="style">
    <right-click-menu :position="position" :current-obj="obj" :replacedItems="replacedItems">
      <div v-if="!isRoot" class="folder-title hover-color" @click="open = !open" @contextmenu="handler($event)">
        <v-icon>
          {{ open ? 'mdi-menu-down' : 'mdi-menu-right' }}
        </v-icon>
        <v-icon>
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>

        <div class="folder-name">
          {{ name }}
        </div>
      </div>
    </right-click-menu>
    <div v-if="isRoot || open" :class="[{ 'not-root': !isRoot }, 'folder-body']">
      <planets-folder v-for="child in children" :key="`planets-folder-${child.id}`" :folder="child" />
      <planet-item v-for="item in items" :key="`planets-item-${item.id}`" :planet="item" />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import RightClickMenu from '@/components/games/show/RightClickMenu'
import { mousePosition } from '@/lib/mousePosition'
import PlanetItem from '@/components/templates/pbta/EdgeOfUniverse/menus/PlanetItem'
import { MenuItemModel } from '@/models/MenuItemModel'

export default {
  name: 'PlanetsFolder',

  components: { PlanetItem, RightClickMenu },

  props: {
    folder: { type: Object, required: true },
  },

  data() {
    return {
      open: false,
      position: {
        x: 0,
        y: 0,
      },
    }
  },

  computed: {
    ...mapState({
      master: state => state.game.info.master,
      user: state => state.auth.user,
    }),

    isRoot() {
      return this.folder.depth === 0
    },

    showFolder() {
      return this.user.id === this.master.id || this.deepItems()
    },

    children() {
      return this.folder.children
    },

    items() {
      return this.folder.items
    },

    name() {
      return this.folder.name
    },

    style() {
      const depth = this.folder.depth
      const style = {}
      if (!this.isRoot) {
        style.marginLeft = `${5 * depth}px`
      }

      return style
    },

    obj() {
      return {
        type: 'itemFolder',
        id: this.folder.id,
      }
    },

    replacedItems() {
      return [
        { title: 'Добавить папку', callback: () => this.createFolder() },
        { title: 'Добавить планету', callback: () => this.newPlanetModel() },
        { title: 'Переименовать', callback: () => this.renameFolder() },
        { title: 'Удалить', callback: () => this.deleteFolder() },
      ]
    },
  },

  methods: {
    deepItems() {
      if (this.items.length > 0) return true
      let have = false
      this.children.forEach(child => {
        if (have) return

        have = child.items.length > 0
      })

      return have
    },

    handler(e) {
      if (this.user.id !== this.master.id) return

      this.position = mousePosition(e)
      this.$store.commit('game/updateCurrentRightClickMenu', `itemFolder-${this.folder.id}`)
      e.preventDefault()
    },

    createFolder() {
      const key = Date.now()
      this.$store.commit('game/addOpenModal',
        {
          name: 'rename-item-folder',
          parentId: this.folder.id,
          key,
          isNew: true,
          oldName: 'Новая папка',
        })
    },

    renameFolder() {
      const key = Date.now()
      this.$store.commit('game/addOpenModal',
        {
          name: 'rename-item-folder',
          id: this.folder.id,
          key,
          isNew: false,
          oldName: this.folder.name,
        })
    },

    deleteFolder() {
      this.$cable.perform({
        channel: 'GameChannel',
        action: 'remove',
        data: { id: this.folder.id, type: 'item_folder' },
      })
    },

    newPlanetModel() {
      const key = Date.now()
      const planet = new MenuItemModel()
      planet.menuId = this.menu.id
      planet.folderId = this.folder.id
      this.$store.commit('game/addOpenModal', {
        name: 'planet',
        key,
        isNew: true,
        isEdit: true,
        planet,
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import '~assets/css/colors';

.folder-title {
  display: grid;
  grid-template-columns: max-content max-content 1fr;
  grid-column-gap: 5px;
  cursor: pointer;
}

.folder-body {
  margin-left: 5px;
}

.not-root {
  margin-left: 30px;
}

.hover-color {
  &:hover {
    background: $indigoRGBA;
  }
}

.folder-name {
  line-height: 32px;
  white-space: nowrap;
}

.actions {
  display: grid;
  grid-template-columns:repeat(2, 1fr);
  grid-column-gap: 5px;
  margin-left: 5px;
  margin-right: 2px;
  margin-bottom: 10px;
}

.selectButton {
  margin: 0;
  width: auto;
}
</style>
