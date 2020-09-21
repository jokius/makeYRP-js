<template>
  <v-dialog :value="obj.open" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или Изменить описание
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
              v-model="text"
              label="описание"
              color="indigo"
            />
          </v-col>
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

export default {
  name: 'DescriptionSpecialModal',

  model: {
    prop: 'obj',
    event: 'changeSpecial',
  },

  props: {
    obj: { type: Object, required: true },
  },

  computed: {
    isValid() {
      return (this.name && this.name !== '' && this.text && this.text !== '')
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

    text: {
      get() {
        return this.special.text
      },

      set(value) {
        this.input('text', value)
      },
    },
  },

  methods: {
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
