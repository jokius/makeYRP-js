<template>
  <div class="list-item">
    <drag :transfer-data="{ sheet }" :draggable="sheet.acl.canWrite">
      <div :class="sheet.acl.canWrite ? 'pointer' : null" @click="showSheet">
        <right-click-menu :position="position" :current-obj="obj" :acl="sheet.acl" :replacedItems="replacedItems">
          <div class="drag-part" @contextmenu="handler($event, sheet)">
            <v-avatar color="indigo" size="32" tile>
              <v-img
                v-if="sheet.imgChat"
                :src="sheet.imgChat"
                :alt="sheet.name"
              />
            </v-avatar>
            <div class="sheet-name">
              {{ sheet.name }}
            </div>
          </div>
        </right-click-menu>
      </div>
    </drag>
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="showSheet">
          <v-list-item-title>Посмотреть</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="sheet.acl.canFull" @click="showAccess">
          <v-list-item-title>Доступы</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="sheet.acl.canFull" @click="cloneSheet">
          <v-list-item-title>Копировать</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="sheet.acl.canFull" @click="deleteSheet">
          <v-list-item-title>Удалить</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import RightClickMenu from '@/components/games/show/RightClickMenu'
import { mousePosition } from '@/lib/mousePosition'

export default {
  name: 'SheetItem',

  components: { RightClickMenu },

  props: {
    sheet: { type: Object, required: true },
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
        type: 'sheet',
        id: this.sheet.id,
      }
    },

    replacedItems() {
      return [
        { title: 'Просмотреть', callback: () => this.showSheet(), level: 'canRead' },
        { title: 'Доступы', callback: () => this.showAccess(), level: 'canFull' },
        { title: 'Копировать', callback: () => this.cloneSheet(), level: 'canFull' },
        { title: 'Удалить', callback: () => this.deleteSheet(), level: 'canFull' },
      ]
    }
  },

  methods: {
    handler(e) {
      this.position = mousePosition(e)
      this.$store.commit('game/updateCurrentRightClickMenu', `sheet-${this.sheet.id}`)
      e.preventDefault()
    },

    showSheet() {
      const key = Date.now()
      const { id, sheetType } = this.sheet
      this.$store.commit('game/addOpenModal', { name: 'sheet', key, id, sheetType })
    },

    showAccess() {
      const key = Date.now()
      this.$store.commit('game/addOpenModal',
        {
          name: 'access',
          key,
          obj: { ...this.obj, type: 'sheet' }
        })
    },

    cloneSheet() {
      this.$cable.perform({
        channel: 'GameChannel',
        action: 'clone',
        data: { id: this.sheet.id, type: 'sheet' },
      })
    },

    deleteSheet() {
      this.$cable.perform({
        channel: 'GameChannel',
        action: 'remove',
        data: { id: this.sheet.id, type: 'sheet' },
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import '~assets/css/colors';

.list-item {
  display: grid;
  grid-template-columns: 1fr max-content;
  background-color: $grayEE;
}

.pointer {
  cursor: pointer;
}

.drag-part {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-column-gap: 5px;
}

.sheet-name {
  font-size: 16px;
  text-align: center;
  line-height: 32px;
  min-height: 32px;
  width: 100%;
}
</style>
