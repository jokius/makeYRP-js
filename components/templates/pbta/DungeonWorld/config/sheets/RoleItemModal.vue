<template>
  <v-dialog :value="obj.open" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или Изменить предмет
      </v-card-title>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-autocomplete
              v-model="item"
              :items="itemsList"
              color="indigo"
              label="стандартные предметы"
            />

            <v-text-field
              v-model="name"
              label="название"
              color="indigo"
            />

            <v-textarea
              v-model="description"
              label="описание"
              color="indigo"
              rows="2"
              auto-grow
            />

            <v-text-field
              v-model.number="quantity"
              label="количество"
              color="indigo"
              type="number"
            />

            <v-text-field
              v-model.number="use"
              label="количество использований"
              color="indigo"
              type="number"
            />

            <v-text-field
              v-model.number="price"
              label="Цена"
              color="indigo"
              type="number"
            />

            <v-text-field
              v-model.number="weight"
              label="Вес"
              color="indigo"
              type="number"
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

            <v-checkbox
              v-model="protectionAdd"
              label="+броня"
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
    name: 'RoleItemModal',

    model: {
      prop: 'obj',
      event: 'changeItem',
    },

    props: {
      obj: { type: Object, required: true },
      items: { type: Array, required: true },
    },

    created() {
      if (!this.item.tags) {
        this.$set(this.item, 'tags', [])
      }
    },

    computed: {
      isValid() {
        return this.name && this.name !== ''
      },

      itemsList() {
        return this.items.map(item => ({ value: item, text: item.name }))
      },

      item: {
        get() {
          return this.obj.item
        },

        set(value) {
          Object.keys(value).forEach(key => this.$set(this.item, key, value[key]))
        }
      },

      name: {
        get() {
          return this.item.name
        },

        set(value) {
          this.$set(this.item, 'name', value)
        }
      },

      damage: {
        get() {
          return this.item.damage
        },

        set(value) {
          this.$set(this.item, 'damage', value)
        }
      },

      quantity: {
        get() {
          return this.item.quantity
        },

        set(value) {
          this.$set(this.item, 'quantity', value)
        }
      },

      use: {
        get() {
          return this.item.use
        },

        set(value) {
          this.$set(this.item, 'use', value)
        }
      },

      price: {
        get() {
          return this.item.price
        },

        set(value) {
          this.$set(this.item, 'price', value)
        }
      },

      weight: {
        get() {
          return this.item.weight
        },

        set(value) {
          this.$set(this.item, 'weight', value)
        }
      },

      protection: {
        get() {
          return this.item.protection
        },

        set(value) {
          this.$set(this.item, 'protection', value)
        }
      },

      protectionAdd: {
        get() {
          return this.item.protectionAdd
        },

        set(value) {
          this.$set(this.item, 'protectionAdd', value)
        }
      },

      description: {
        get() {
          return this.item.description
        },

        set(value) {
          this.$set(this.item, 'description', value)
        }
      },

      tags: {
        get() {
          return this.item.tags.join(',')
        },

        set(value) {
          const tags = value.split(',').map(item => item.trim()).filter(item => item && item !== '')
          this.$set(this.item, 'tags', tags)
        }
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
