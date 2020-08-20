<template>
  <right-click-menu :position="position" :current-obj="obj" :acl="note.acl" :replacedItems="replacedItems">
    <v-list-item class="note-item-grid" @contextmenu="handler($event)">
      <span>{{ note.params.title }}</span>
      <v-btn
        fab
        x-small
        dark
        @click="viewNote"
      >
        <v-icon>mdi-eye-outline</v-icon>
      </v-btn>
      <v-btn
        v-if="note.acl.canWrite"
        fab
        x-small
        dark
        @click="editNote"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        v-if="note.acl.canFull"
        color="red darken-4"
        fab
        x-small
        dark
        @click="deleteNote"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-list-item>
  </right-click-menu>
</template>

<script>
  import RightClickMenu from '@/components/games/show/RightClickMenu'
  import { mousePosition } from '@/lib/mousePosition'

  export default {
    name: 'NoteItem',

    components: { RightClickMenu },

    props: {
      note: { type: Object, required: true },
    },

    data: () => ({
      position: {
        x: 0,
        y: 0,
      },
    }),

    computed: {
      obj() {
        return {
          type: 'note',
          id: this.note.id,
        }
      },

      replacedItems() {
        return [
          { title: 'Изменить', callback: () => this.editNote(), level: 'canWrite' },
          { title: 'Просмотреть', callback: () => this.viewNote(), level: 'canRead' },
          { title: 'Доступы', callback: () => this.showAccess(), level: 'canFull' },
          { title: 'Удалить', callback: () => this.deleteNote(), level: 'canFull' },
        ]
      }
    },

    methods: {
      handler(e) {
        this.position = mousePosition(e)
        this.$store.commit('game/updateCurrentRightClickMenu', `note-${this.note.id}`)
        e.preventDefault()
      },

      viewNote() {
        this.showModal(false)
      },

      editNote() {
        this.showModal(true)
      },

      showAccess() {
        const key = Date.now()
        this.$store.commit('game/addOpenModal',
          {
            name: 'access',
            key,
            obj: { ...this.obj, type: 'menu_item' }
          })
      },

      showModal(isEdit) {
        const key = Date.now()
        this.$store.commit('game/addOpenModal',
                           {
                             name: 'note',
                             key,
                             isNew: false,
                             isEdit: isEdit,
                             note: this.note,
                           })
      },

      deleteNote() {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'remove',
          data: { id: this.note.id, type: 'menu_item' },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .note-item-grid {
    display: grid;
    grid-template-columns: 1fr max-content max-content max-content;
    grid-column-gap: 5px;
    justify-items: center;
    align-items: center;
  }
</style>
