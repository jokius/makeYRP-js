<template>
  <div class="item-element">
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-text-field
          v-model="label"
          label="описание"
          color="indigo"
        />

        <v-checkbox
          v-model="multiple"
          color="indigo"
          label="множественный выбор"
        />

        <select-special-item
          v-for="(item, index) in list"
          :key="`select-list-${index}`"
          :item="item"
          :input="(key, value) => inputItem(key, value, index)"
          :remove="() => removeItem(index)"
        />
      </v-col>

      <div class="actions">
        <v-btn
          class="button"
          color="indigo"
          @click="addItem"
          dark
        >
          <span>Добавить выбор</span>
        </v-btn>
        <v-spacer />
        <v-btn
          class="item-remove"
          color="red darken-4"
          small
          dark
          @click="remove"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </v-row>
  </div>
</template>

<script>
import SelectSpecialItem from '@/components/templates/pbta/EdgeOfUniverse/config/specials/SelectSpecialItem'

export default {
  name: 'SelectsSpecialItem',

  components: { SelectSpecialItem },

  props: {
    select: { type: Object, required: true },
    input: { type: Function, required: true },
    remove: { type: Function, required: true },
  },

  computed: {
    label: {
      get() {
        return this.select.label
      },

      set(value) {
        this.input('label', value)
      },
    },

    multiple: {
      get() {
        return this.select.multiple
      },

      set(value) {
        this.input('multiple', value)
      },
    },

    list() {
      return this.select.list || []
    },
  },

  methods: {
    addItem() {
      const list = JSON.parse(JSON.stringify(this.list))
      list.push({ text: '', value: '' })
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
  },
}
</script>

<style scoped lang="scss">
.item-element {
  margin-bottom: 10px;
}

.actions {
  display: grid;
  grid-template-columns: max-content 10px max-content;
}
</style>
