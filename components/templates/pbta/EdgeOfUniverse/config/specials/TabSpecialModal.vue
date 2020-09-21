<template>
  <v-dialog :value="obj.open" persistent fullscreen>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или Изменить вкладку
      </v-card-title>
      <v-text-field
        v-model="name"
        label="название"
        color="indigo"
      />

      <v-overflow-btn
        :items="items"
        label="Добавить..."
        color="black"
        segmented
        item-color="black"
        hide-details
        class="add-button"
        @change="value => add(value)"
      />

      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">Название</th>
            <th class="text-left">Тип</th>
            <th class="text-left" />
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in tabItems" :key="`tab-items-${index}`">
            <td>{{ item.name }}</td>
            <td>{{ typesTranslate[item.type] }}</td>
            <td class="actions cell">
              <v-btn color="indigo" dark @click="showModal({ ...item, restore: true }, item.type)">
                <span>Изменить</span>
              </v-btn>
              <v-btn
                v-if="item.remove"
                color="red darken-4"
                fab
                x-small
                dark
                @click="removeTabItem(index)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>

      <v-divider />

      <v-card-actions>
        <v-btn
          dark
          color="indigo"
          @click="close"
        >
          Закрыть
        </v-btn>

        <v-spacer />

        <v-btn
          :disabled="!isValid"
          color="indigo"
          @click="change"
        >
          <span :class="{ 'white--text': isValid }">Сохранить</span>
        </v-btn>
      </v-card-actions>
    </v-card>

    <counter-special-modal v-if="modalOpen && tabItem.type === 'counter'" v-model="tabItemObj" />
    <description-special-modal v-if="modalOpen && tabItem.type === 'description'" v-model="tabItemObj" />
    <select-special-modal v-if="modalOpen && tabItem.type === 'select'" v-model="tabItemObj" />
    <moves-special-modal v-if="modalOpen && tabItem.type === 'moves'" v-model="tabItemObj" :role-key="roleKey" />
    <equipment-special-modal v-if="modalOpen && tabItem.type === 'equipment'" v-model="tabItemObj" />
    <block-special-modal v-if="modalOpen && tabItem.type === 'block'" v-model="tabItemObj" :role-key="roleKey" />
    <block-line-special-modal v-if="modalOpen && tabItem.type === 'blockLine'" v-model="tabItemObj" />
    <text-field-special-modal v-if="modalOpen && tabItem.type === 'textField'" v-model="tabItemObj" type="text" />
  </v-dialog>
</template>

<script>
import { omitBy } from 'lodash'
import { mapState } from 'vuex'
import CounterSpecialModal from '@/components/templates/pbta/EdgeOfUniverse/config/specials/CounterSpecialModal'
import DescriptionSpecialModal
  from '@/components/templates/pbta/EdgeOfUniverse/config/specials/DescriptionSpecialModal'
import SelectSpecialModal from '@/components/templates/pbta/EdgeOfUniverse/config/specials/SelectSpecialModal'
import EquipmentSpecialModal from '@/components/templates/pbta/EdgeOfUniverse/config/specials/EquipmentSpecialModal'
import TextFieldSpecialModal from '@/components/templates/pbta/EdgeOfUniverse/config/specials/TextFieldSpecialModal'
import BlockSpecialModal from '@/components/templates/pbta/EdgeOfUniverse/config/specials/BlockSpecialModal'
import BlockLineSpecialModal from '@/components/templates/pbta/EdgeOfUniverse/config/specials/BlockLineSpecialModal'
import MovesSpecialModal from '@/components/templates/pbta/EdgeOfUniverse/config/specials/MovesSpecialModal'

export default {
  name: 'TabSpecialModal',

  components: {
    MovesSpecialModal,
    BlockLineSpecialModal,
    BlockSpecialModal,
    TextFieldSpecialModal,
    EquipmentSpecialModal,
    SelectSpecialModal,
    DescriptionSpecialModal,
    CounterSpecialModal,
  },

  model: {
    prop: 'obj',
    event: 'changeSpecial',
  },

  props: {
    roleKey: { type: String, required: true },
    obj: { type: Object, required: true },
  },

  data() {
    return {
      modalOpen: false,
      tabItem: {},
      items: [
        { text: 'Добавить счётчик', value: 'counter', callback: () => this.add('counter') },
        { text: 'Добавить описание', value: 'description', callback: () => this.add('description') },
        { text: 'Добавить список', value: 'select', callback: () => this.add('select') },
        { text: 'Добавить список ходов', value: 'moves', callback: () => this.add('moves') },
        { text: 'Добавить снаряжение', value: 'equipment', callback: () => this.add('equipment') },
        { text: 'Добавить блок элементов', value: 'block', callback: () => this.add('block') },
        { text: 'Добавить несколько блоков в строку', value: 'blockLine', callback: () => this.add('blockLine') },
        { text: 'Добавить текстовое поле', value: 'textField', callback: () => this.add('textField') },
      ],
    }
  },

  computed: {
    ...mapState({
      game: state => state.gameConfig.info,
    }),

    tables() {
      return this.game.template.tables
    },

    isValid() {
      return (this.name && this.name !== '' && this.items.length > 0)
    },

    special() {
      return this.obj.special
    },

    name: {
      get() {
        return this.special.name
      },

      set(value) {
        this.input('name', value)
      },
    },

    tabItems() {
      return this.special.items
    },

    typesTranslate() {
      return this.tables.tabItemsTypes
    },

    tabItemObj: {
      get() {
        return { open: this.modalOpen, special: this.tabItem }
      },

      set({ open, special, isClose }) {
        if (!isClose) this.changeTabItem(special)

        this.modalOpen = open
      },
    },
  },

  methods: {
    add(type) {
      this.showModal({ remove: true }, type)
    },

    showModal(tabItem, type) {
      this.tabItem = { ...tabItem, type: type }
      this.modalOpen = true
    },

    changeTabItem(tabItem) {
      const items = this.special.items.slice()
      const oldTabItemIndex = items.findIndex(item => item.name === tabItem.name && item.type === tabItem.type)

      if (oldTabItemIndex >= 0) {
        items[oldTabItemIndex] = tabItem
      } else {
        items.push(tabItem)
      }

      this.input('items', items)
    },

    removeTabItem(index) {
      const items = this.special.items.slice()
      items.splice(index, 1)
      this.input('items', items)
    },

    input(key, value) {
      this.$set(this.special, key, value)
    },

    change() {
      if (this.isValid) {
        this.$emit('changeSpecial', {
          open: false,
          special: omitBy(this.special,
            value => typeof value === 'undefined' || value === null || value === ''),
        })
      }
    },

    close() {
      this.$emit('changeSpecial', { open: false, isClose: true })
    },
  },
}
</script>

<style scoped lang="scss">
.button {
  margin-bottom: 5px;
}
</style>
