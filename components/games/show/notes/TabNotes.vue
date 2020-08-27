<template>
  <div>
    <v-overflow-btn
      class="selectButton"
      :items="items"
      label="Создать"
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
          { text: 'папку', value: 'folder' },
          { text: 'заметку', value: 'note' },
        ]
      }
    },

    computed: {
      ...mapState({
        menus: state => state.game.info.menus,
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
        switch (type) {
          case 'folder':
            this.$store.commit('game/addOpenModal',
              {
                name: 'rename-item-folder',
                parentId: this.folder.id,
                key,
                isNew: true,
                oldName: 'Новая папка',
              })
            return
          case 'note':
            const note = new MenuItemModel()
            note.folderId = this.folder.id
            this.$store.commit('game/addOpenModal', {
              name: 'note',
              key,
              isNew: true,
              isEdit: true,
              note,
            })
        }
      },
    }
  }
</script>
