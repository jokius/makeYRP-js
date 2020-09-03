<template>
  <div class="notes-body">
    <v-overflow-btn
      v-if="user.id === master.id"
      class="selectButton"
      :items="items"
      label="Создать..."
      color="indigo"
      segmented
      item-color="indigo"
      hide-details
      @change="value => add(value)"
    />

    <notes-folder :folder="menu.rootFolder" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import NotesFolder from '@/components/games/show/notes/NotesFolder'
  import { MenuItemModel } from '@/models/MenuItemModel'

  export default {
    name: 'TabNotes',

    components: { NotesFolder },

    data() {
      return {
        items: [
          { text: 'создать папку', value: 'folder', callback: () => this.add('folder') },
          { text: 'создать заметку', value: 'note', callback: () => this.add('note') },
        ]
      }
    },

    computed: {
      ...mapState({
        menus: state => state.game.info.menus,
        master: state => state.game.info.master,
        user: state => state.auth.user,
      }),

      menu: {
        get() {
          return this.menus.find(item => item.type === 'notes')
        },
      },
    },

    methods: {
      add(type) {
        const key = Date.now()
        const folderId = this.menu.rootFolder.id
        switch (type) {
          case 'folder':
            this.$store.commit('game/addOpenModal',
              {
                name: 'rename-item-folder',
                parentId: folderId,
                key,
                isNew: true,
                oldName: 'Новая папка',
              })
            return
          case 'note':
            const note = new MenuItemModel()
            note.folderId = folderId
            this.$store.commit('game/addOpenModal', {
              name: 'note',
              key,
              isNew: true,
              isEdit: true,
              note,
            })
            return
        }
      },
    },
  }
</script>

<style scoped lang="scss">
.notes-body {
  position: relative;
  bottom: 12px;
  overflow: auto;
  height: 94vh;
}
</style>
