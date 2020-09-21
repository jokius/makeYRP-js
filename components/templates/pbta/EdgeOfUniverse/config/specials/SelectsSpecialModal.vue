<template>
  <v-dialog :value="obj.open" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или Изменить группу списков
      </v-card-title>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-text-field
              v-model="name"
              label="название"
              color="indigo"
            />

            <selects-special-item
              v-for="(select, index) in selects"
              :key="`selects-list-${index}`"
              :select="select"
              :input="(key, value) => inputItem(key, value, index)"
              :remove="() => removeItem(index)"
            />
          </v-col>

          <v-btn
            class="button"
            color="indigo"
            @click="addSelect"
            dark
          >
            <span>Добавить список</span>
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
import SelectsSpecialItem from '@/components/templates/pbta/EdgeOfUniverse/config/specials/SelectsSpecialItem'

export default {
  name: 'SelectsSpecialModal',

  components: { SelectsSpecialItem },

  model: {
    prop: 'obj',
    event: 'changeSpecial',
  },

  props: {
    obj: { type: Object, required: true },
  },

  computed: {
    isValid() {
      return (this.name && this.name !== '' && this.selects.length > 0)
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

    selects() {
      return this.special.selects || []
    },
  },

  methods: {
    addSelect() {
      const selects = JSON.parse(JSON.stringify(this.selects))
      selects.push({ label: '', list: [] })
      this.input('selects', selects)
    },

    removeItem(index) {
      const selects = JSON.parse(JSON.stringify(this.selects))
      selects.splice(index, 1)
      this.input('selects', selects)
    },

    inputItem(key, value, index) {
      const selects = JSON.parse(JSON.stringify(this.selects))
      selects[index] = { ...selects[index], [key]: value }
      this.input('selects', selects)
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
