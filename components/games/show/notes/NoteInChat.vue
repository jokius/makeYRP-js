<template>
  <div class="grid-message gray-board">
    <div class="title-block gray-body">
      <span class="title-body">{{ body.name }}</span>
    </div>

    <div class="show-button">
      <v-btn
        raised
        color="black"
        dark
        @click="showNote"
        :disabled="!noteIsExist"
      >
        <span :class="{ 'black--text': !noteIsExist }">
          {{ noteIsExist ? 'Показать заметку' : 'Заметка не доступна' }}
        </span>
      </v-btn>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'NoteInChat',

    props: {
      body: { type: Object, required: true },
    },
    computed: {
      ...mapState({
        menus: state => state.game.info.menus,
      }),

      menu() {
        return this.menus.find(item => item.type === 'notes')
      },

      note() {
        const folder = this.menu.folderById(this.menu.rootFolder, this.body.folderId)
        return folder.items.find(item => item.id === this.body.id) || null
      },

      noteIsExist() {
        return this.note !== null
      },
    },

    methods: {
      showNote() {
        const key = Date.now()
        this.$store.commit('game/addOpenModal',
          {
            name: 'note',
            key,
            isNew: false,
            isEdit: false,
            note: this.note,
          })
      }
    },
  }
</script>

<style scoped lang="scss">
@import '~assets/css/colors';

@import '~assets/css/colors';

$border: 3px solid $black;
$size: 60px;

.grid-message {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto;
  grid-row-gap: 5px;
  background: $white;
}

.gray-board {
  border: 1px solid $gray42;
}

.title-block {
  color: $white;
  text-align: center;
}

.title-body {
  font-size: 20px;
}

.gray-body {
  background-color: $gray42;
}

.show-button {
  width: 50%;
  margin: 5px auto;
}
</style>
