<template>
  <v-dialog :value="obj.open" persistent fullscreen>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или Изменить предметы класса
      </v-card-title>

      <v-btn color="indigo" dark @click="showSelectModal(selects.length)">
        <span>Новая группа</span>
      </v-btn>

      <details class="items" open>
        <summary class="items-title">Обязательные предметы</summary>
        <div class="actions">
          <v-btn color="indigo" dark @click="showModal({ remove: true }, `startingEquipment.${roleKey}`)">
            <span>Новый предмет</span>
          </v-btn>

          <v-btn color="indigo" dark @click="save">
            <span>Сохранить</span>
          </v-btn>
        </div>
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">Название</th>
              <th class="text-left" />
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in startingEquipment" :key="`start-equipment-${index}`">
              <td>{{ item.name }}</td>
              <td class="actions cell">
                <v-btn
                  color="indigo"
                  dark
                  @click="showModal({ ...item, restore: true }, `startingEquipment.${roleKey}`)"
                >
                  <span>Изменить</span>
                </v-btn>
                <v-btn
                  v-if="item.remove || item.restore"
                  color="red darken-4"
                  fab
                  x-small
                  dark
                  @click="removeItem(customItemIndex(item, `startingEquipment.${roleKey}`),
                   `startingEquipment.${roleKey}`)"
                >
                  <v-icon v-if="item.remove">mdi-delete</v-icon>
                  <v-icon v-else>mdi-restore</v-icon>
                </v-btn>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </details>

      <details v-for="select in selects" :key="`select-${select.index}`" class="items" open>
        <summary class="items-title">{{ select.title }}</summary>
        <div class="actions">
          <v-btn
            color="indigo"
            dark
            @click="showModal({ remove: true }, `selectEquipment.${roleKey}[${select.index}].items`)">
            <span>Новый предмет</span>
          </v-btn>

          <v-btn color="indigo" dark @click="showSelectModal(select.index)">
            <v-icon dark>mdi-cog</v-icon>
          </v-btn>

          <v-btn
            color="red darken-4"
            dark
            @click="removeSelect(select.index)"
          >
            <v-icon dark>mdi-delete</v-icon>
          </v-btn>

          <v-btn color="indigo" dark @click="save">
            <span>Сохранить</span>
          </v-btn>
        </div>
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">Название</th>
              <th class="text-left" />
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in selectEquipment[select.index].items"
                :key="`select-equipment-${select.value}-${index}`">
              <td>{{ item.name }}</td>
              <td class="actions cell">
                <v-btn
                  color="indigo"
                  dark
                  @click="showModal({ ...item, restore: true }, `selectEquipment.${roleKey}[${select.index}].items`)">
                  <span>Изменить</span>
                </v-btn>
                <v-btn
                  v-if="item.remove || item.restore"
                  color="red darken-4"
                  fab
                  x-small
                  dark
                  @click="removeItem(customItemIndex(item,
                   `selectEquipment.${roleKey}[${select.index}].items`),
                    `selectEquipment.${roleKey}[${select.index}].items`)"
                >
                  <v-icon v-if="item.remove">mdi-delete</v-icon>
                  <v-icon v-else>mdi-restore</v-icon>
                </v-btn>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </details>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn
          dark
          color="indigo"
          @click="close"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>

    <role-item-modal v-if="modalOpen" v-model="itemObj" :items="items" />
    <select-item-modal v-if="selectModalOpen" v-model="selectObj" />
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { uniqBy } from 'lodash'
import RoleItemModal from '~/components/templates/pbta/EdgeOfUniverse/config/sheets/RoleItemModal'
import SelectItemModal from '~/components/templates/pbta/EdgeOfUniverse/config/sheets/SelectItemModal'

export default {
  name: 'RoleItemsModal',

  components: { SelectItemModal, RoleItemModal },

  model: {
    prop: 'obj',
    event: 'changeRole',
  },

  props: {
    obj: { type: Object, required: true },
    roleKey: { type: String, required: true },
  },

  data() {
    return {
      modalOpen: false,
      selectModalOpen: false,
      item: {},
      index: 0,
      select: {},
    }
  },

  computed: {
    ...mapState({
      game: state => state.gameConfig.info,
    }),

    tables() {
      return this.game.template.tables
    },

    customTables() {
      return this.game.customTemplate.tables
    },

    items() {
      const list = this.customTables.items.slice()
      return uniqBy(list.concat(this.tables.items.slice()), item => item.name)
    },

    startingEquipment() {
      const list = this.customTables.startingEquipment[this.roleKey].slice()

      return uniqBy(list.concat((this.tables.startingEquipment[this.roleKey] || []).slice()), item => item.name)
    },

    selectEquipment() {
      const list = this.customTables.selectEquipment[this.roleKey].slice()

      return uniqBy(list.concat((this.tables.selectEquipment[this.roleKey] || []).slice()), item => item.title)
    },

    selects() {
      return this.selectEquipment.map((item, index) => ({ index, title: item.title }))
    },

    itemObj: {
      get() {
        return { open: this.modalOpen, item: this.item }
      },

      set({ open, item, isClose }) {
        if (!isClose) this.changeItem(item)

        this.modalOpen = open
      },
    },

    selectObj: {
      get() {
        return { open: this.selectModalOpen, select: this.select, index: this.index }
      },

      set({ open, select, index, isClose }) {
        if (!isClose) this.changeSelect(select, index)

        this.selectModalOpen = open
      },
    },
  },

  created() {
    if (!this.customTables) {
      this.$store.commit('gameConfig/update', { path: `customTemplate.tables`, value: {} })
    }

    if (!this.customTables.items) {
      this.$store.commit('gameConfig/update', { path: `customTemplate.tables.items`, value: [] })
    }

    if (!this.customTables.startingEquipment) {
      this.$store.commit('gameConfig/update', { path: `customTemplate.tables.startingEquipment`, value: {} })
    }

    if (!this.customTables.startingEquipment[this.roleKey]) {
      this.$store.commit('gameConfig/update',
        { path: `customTemplate.tables.startingEquipment.${this.roleKey}`, value: [] })
    }

    if (!this.customTables.selectEquipment) {
      this.$store.commit('gameConfig/update', { path: `customTemplate.tables.selectEquipment`, value: {} })
    }

    if (!this.customTables.selectEquipment[this.roleKey]) {
      this.$store.commit('gameConfig/update',
        { path: `customTemplate.tables.selectEquipment.${this.roleKey}`, value: [] })
    }
  },

  methods: {
    showModal(item, group) {
      this.item = item
      this.group = group
      this.modalOpen = true
    },

    showSelectModal(index) {
      this.index = index
      this.select = { ...(this.selectEquipment[index] || { title: '', multiple: false, items: [] }) }
      this.selectModalOpen = true
    },

    changeItem(item) {
      const items = (this.customTables?.[this.group] || []).slice()
      const oldItemIndex = items.findIndex(obj => obj.name === item.name)

      if (oldItemIndex >= 0) {
        items[oldItemIndex] = item
      } else {
        items.push(item)
      }

      this.$store.commit('gameConfig/update', { path: `customTemplate.tables.${this.group}`, value: items })
    },

    changeSelect(select, index) {
      const selects = this.selectEquipment.slice()
      selects[index] = select

      this.$store.commit('gameConfig/update',
        { path: `customTemplate.tables.selectEquipment.${this.roleKey}`, value: selects })
    },

    customItemIndex(item, group) {
      return (this.customTables?.[group] || []).findIndex(obj => obj.name === item.name)
    },

    removeItem(index, group) {
      this.$store.commit('gameConfig/update', { path: `customTemplate.tables.${group}`, value: index, remove: true })
    },

    removeSelect(index) {
      this.$store.commit('gameConfig/update',
        { path: `customTemplate.tables.selectEquipment.${this.roleKey}`, value: index, remove: true })
    },

    save() {
      this.$store.dispatch('gameConfig/update', { axios: this.$axios, params: this.game.params })
    },

    close() {
      this.$emit('changeRole', { open: false })
    },
  },
}
</script>

<style scoped lang="scss">
@import '~assets/css/colors';

.grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto;
  grid-row-gap: 5px;
}

.items {
  cursor: pointer;
  margin-bottom: 5px;
}

.items-title {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: bold;
}

.actions {
  display: grid;
  grid-template-columns: repeat(4, max-content);
  grid-column-gap: 5px;
  justify-content: center;
  margin-top: 5px;

  &.cell {
    justify-content: normal;
  }
}
</style>
