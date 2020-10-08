<template>
  <div v-if="showFolder(folder)" :style="style">
    <drop class="drop" @drop="handleDrop">
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
        <sheets-folder v-for="child in children" :key="`sheets-folder-${child.id}`" :folder="child" />
        <sheet-item v-for="sheet in sheets" :key="`sheets-item-${sheet.id}`" :sheet="sheet" />
      </div>
    </drop>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mousePosition } from '@/lib/mousePosition'
import RightClickMenu from '@/components/games/show/RightClickMenu'
import SheetItem from '@/components/games/show/sheets/SheetItem'

export default {
  name: 'SheetsFolder',

  components: { SheetItem, RightClickMenu },

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
      sheetTypes: state => state.game.info.sheetTypes,
      master: state => state.game.info.master,
      user: state => state.auth.user,
    }),

    isMaster() {
      return this.user.id === this.master.id
    },

    isRoot() {
      return this.folder.depth === 0
    },

    children() {
      return this.folder.children
    },

    sheets() {
      return this.folder.sheets
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
        type: 'sheetFolder',
        id: this.folder.id,
      }
    },

    replacedItems() {
      let list = []
      if (this.isMaster) {
        list = [
          { title: 'Добавить папку', callback: () => this.addFolder() },
          { title: 'Переименовать папку', callback: () => this.renameFolder() },
          { title: 'Удалить папку', callback: () => this.deleteFolder() },
        ]
      }

      return list.concat(this.sheetTypes.map(type => ({
        title: `Добавить ${type.text}`, callback: () => this.addSheet(type.value),
      })))
    },
  },

  methods: {
    handleDrop({ sheet }) {
      if (!sheet.acl.canWrite || !sheet || this.folder.id === sheet.folderId) return

      this.$cable.perform({
        channel: 'GameChannel',
        action: 'change_folder',
        data: { ...sheet, type: 'sheet', folder_id: this.folder.id },
      })
    },

    showFolder(folder) {
      return this.user.id === this.master.id || this.deepItems(folder)
    },

    deepItems(folder) {
      if (folder.isRoot || folder.sheets.length > 0) return true

      let have = false
      folder.children.forEach(child => {
        if (have) return

        have = child.sheets.length > 0
        if (have) return

        have = this.deepItems(child)
      })

      return have
    },

    handler(e) {
      this.position = mousePosition(e)
      this.$store.commit('game/updateCurrentRightClickMenu', `sheetFolder-${this.folder.id}`)
      e.preventDefault()
    },

    addFolder() {
      const key = Date.now()
      this.$store.commit('game/addOpenModal',
        {
          name: 'rename-sheet-folder',
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
          name: 'rename-sheet-folder',
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
        data: { id: this.folder.id, type: 'sheet_folder' },
      })
    },

    addSheet(type) {
      this.$cable.perform({
        channel: 'GameChannel',
        action: 'add',
        data: { sheet_type: type, type: 'sheet', folder_id: this.folder.id },
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
