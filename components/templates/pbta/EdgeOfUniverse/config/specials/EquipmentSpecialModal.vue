<template>
  <v-dialog :value="obj.open" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или Изменить снаряжение
      </v-card-title>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-text-field
              v-model="name"
              label="название"
              color="indigo"
            />

            <v-text-field
              v-model="description"
              label="описание"
              color="indigo"
            />

            <v-checkbox
              v-model="multiple"
              color="indigo"
              label="множественный выбор"
            />
            <equipment-special-item
              v-for="(item, index) in list"
              :key="`equipment-list-${index}`"
              :item="item"
              :input="(key, value) => inputItem(key, value, index)"
              :remove="() => removeItem(index)"
            />
          </v-col>

          <v-btn
            class="button"
            color="indigo"
            @click="addEquipment"
            dark
          >
            <span>Добавить выбор</span>
          </v-btn>
        </v-row>
      </v-container>

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
  </v-dialog>
</template>

<script>
import { omitBy } from 'lodash'
import EquipmentSpecialItem from '@/components/templates/pbta/EdgeOfUniverse/config/specials/EquipmentSpecialItem'

export default {
  name: 'EquipmentSpecialModal',

  components: { EquipmentSpecialItem },

  model: {
    prop: 'obj',
    event: 'changeSpecial',
  },

  props: {
    obj: { type: Object, required: true },
  },

  computed: {
    isValid() {
      return (this.name && this.name !== '' && this.list.length > 0)
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

    description: {
      get() {
        return this.special.description
      },

      set(value) {
        this.input('description', value)
      },
    },

    multiple: {
      get() {
        return this.special.multiple
      },

      set(value) {
        this.input('multiple', value)
      },
    },

    list() {
      return this.special.list || []
    },
  },

  methods: {
    addEquipment() {
      const list = JSON.parse(JSON.stringify(this.list))
      list.push({ enable: false })
      this.input('list', list)
    },

    removeItem(index) {
      const list = JSON.parse(JSON.stringify(this.list))
      list.splice(index, 1)
      this.input('list', list)
    },

    inputItem(key, value, index) {
      const list = JSON.parse(JSON.stringify(this.list))
      list[index] = { ...list[index], [key]: value }
      this.input('list', list)
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
