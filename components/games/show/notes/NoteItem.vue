<template>
  <right-click-menu :position="position" :current-obj="obj" :acl="note.acl" :replacedItems="replacedItems">
    <div class="note-item-grid hover-color" @contextmenu="handler($event)">
      <v-icon>mdi-note</v-icon>
      <div class="note-item-title" @click="open">{{ name }}</div>

      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="sendNote">
            <v-list-item-title>В чат</v-list-item-title>
          </v-list-item>
          <v-list-item @click="viewNote">
            <v-list-item-title>Посмотреть</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="note.acl.canWrite" @click="editNote">
            <v-list-item-title>Изменить</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="note.acl.canFull" @click="showAccess">
            <v-list-item-title>Доступы</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="note.acl.canFull" @click="deleteNote">
            <v-list-item-title>Удалить</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
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

      name() {
        return this.note.params.title
      },

      replacedItems() {
        return [
          { title: 'В чат', callback: () => this.sendNote(), level: 'canFull' },
          { title: 'Изменить', callback: () => this.editNote(), level: 'canWrite' },
          { title: 'Просмотреть', callback: () => this.viewNote(), level: 'canRead' },
          { title: 'Доступы', callback: () => this.showAccess(), level: 'canFull' },
          { title: 'Удалить', callback: () => this.deleteNote(), level: 'canFull' },
        ]
      }
    },

    methods: {
      open() {
        if (this.note.acl.canWrite) {
          this.editNote()
        } else {
          this.viewNote()
        }
      },

      handler(e) {
        this.position = mousePosition(e)
        this.$store.commit('game/updateCurrentRightClickMenu', `note-${this.note.id}`)
        e.preventDefault()
      },

      sendNote() {
        console.log('this.note.acl', this.note.acl)
        const data = { read_all: true, type: 'menu_item', id: this.note.id }
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'change_access',
          data,
        })

        this.$cable.perform({
          channel: 'GameChannel',
          action: 'add',
          data: {
            type: 'message',
            body: {
              name: this.name,
              id: this.note.id,
              folderId: this.note.folderId,
              isNote: true,
            },
          },
        })
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
  grid-template-columns: max-content 1fr max-content;
  grid-column-gap: 5px;
  margin-bottom: 10px;
}

.note-item-title {
  line-height: 32px;
  cursor: pointer;
}

.hover-color {
  &:hover {
    background: $indigoRGBA;
  }
}
</style>
