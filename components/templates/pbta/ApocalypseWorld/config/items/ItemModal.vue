<template>
  <v-dialog :value="obj.open" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или Изменить предмет
      </v-card-title>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <div>Выбрать или добавить категорию</div>
            <v-select
              v-model="type"
              :items="types"
              color="indigo"
            />

            <v-text-field
              v-model="type"
              color="indigo"
            />

            <v-text-field
              v-model="name"
              label="название"
              color="indigo"
            />

            <v-text-field
              v-model.number="damage"
              label="урон"
              color="indigo"
              type="number"
            />

            <v-text-field
              v-model.number="protection"
              label="защита"
              color="indigo"
              type="number"
            />

            <v-textarea
              v-model="description"
              label="описание"
              color="indigo"
              rows="2"
              auto-grow
            />

            <v-text-field
              v-model="tags"
              label="теги"
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
  name: 'ItemModal',

  model: {
    prop: 'obj',
    event: 'changeItem',
  },

  props: {
    obj: { type: Object, required: true },
    types: { type: Array, required: true },
  },

  created() {
    if (!this.item.tags) {
      this.$set(this.item, 'tags', [])
    }
  },

  computed: {
    isValid() {
      return (this.type && this.type !== '' && this.name && this.name !== '')
    },

    item() {
      return this.obj.item
    },

    type: {
      get() {
        return this.item.type
      },

      set(value) {
        this.$set(this.item, 'type', value)
      },
    },

    name: {
      get() {
        return this.item.name
      },

      set(value) {
        this.$set(this.item, 'name', value)
      },
    },

    damage: {
      get() {
        return this.item.damage
      },

      set(value) {
        this.$set(this.item, 'damage', value)
      },
    },

    protection: {
      get() {
        return this.item.protection
      },

      set(value) {
        this.$set(this.item, 'protection', value)
      },
    },

    description: {
      get() {
        return this.item.description
      },

      set(value) {
        this.$set(this.item, 'description', value)
      },
    },

    tags: {
      get() {
        return this.item.tags.join(',')
      },

      set(value) {
        const tags = value.split(',').map(item => item.trim()).filter(item => item && item !== '')
        this.$set(this.item, 'tags', tags)
      },
    },
  },

  methods: {
    change() {
      if (this.isValid) {
        this.$emit('changeItem', {
          open: false,
          item: omitBy(this.item, value => typeof value === 'undefined' || value === null),
        })
      }
    },

    close() {
      this.$emit('changeItem', { open: false, isClose: true })
    },
  },
}
</script>
