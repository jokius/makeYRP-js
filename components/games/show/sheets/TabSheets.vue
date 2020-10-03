<template>
  <div class="grid">
    <v-overflow-btn
      class="selectButton"
      :items="items"
      label="Создать персонажа"
      color="indigo"
      segmented
      item-color="indigo"
      hide-details
      @change="value => add(value)"
    />

    <sheets-folder :folder="game.rootFolder" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SheetsFolder from '@/components/games/show/sheets/SheetsFolder'

export default {
  name: 'TabSheets',

  components: { SheetsFolder },

  computed: {
    ...mapState({
      game: state => state.game.info,
      sheetTypes: state => state.game.info.sheetTypes,
      master: state => state.game.info.master,
      user: state => state.auth.user,
    }),

    isMaster() {
      return this.user.id === this.master.id
    },

    items() {
      const list = []
      if (this.isMaster) {
        list.push({
          text: 'Добавить папку',
          value: 'folder',
          callback: () => this.add('folder'),
        })
      }

      return list.concat(this.sheetTypes.map(type => ({
        text: type.text,
        value: type.value,
        callback: () => this.add(type.value),
      })))
    },
  },

  activated() {
    this.$store.commit('game/resetMarker', 'sheet')
  },

  methods: {
    add(type) {
      const folderId = this.game.rootFolder.id

      if (type === 'folder') {
        const key = Date.now()
        this.$store.commit('game/addOpenModal',
          {
            name: 'rename-sheet-folder',
            parentId: folderId,
            key,
            isNew: true,
            oldName: 'Новая папка',
          })
      } else {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'add',
          data: { sheet_type: type, type: 'sheet', folder_id: folderId },
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto;
  grid-row-gap: 5px;
}

.selectButton {
  margin: 0;
  width: auto;
}
</style>
