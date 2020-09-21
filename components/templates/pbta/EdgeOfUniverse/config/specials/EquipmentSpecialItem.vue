<template>
  <div class="item-element">
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
      min="0"
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

    <v-text-field
      v-model="tags"
      label="теги"
      color="indigo"
    />

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
</template>

<script>
export default {
  name: 'EquipmentSpecialItem',

  props: {
    item: { type: Object, required: true },
    input: { type: Function, required: true },
    remove: { type: Function, required: true },
  },

  computed: {
    name: {
      get() {
        return this.item.name
      },

      set(value) {
        this.input('name', value)
      },
    },

    description: {
      get() {
        return this.item.description
      },

      set(value) {
        this.input('description', value)
      },
    },

    quantity: {
      get() {
        return this.item.quantity
      },

      set(value) {
        this.input('quantity', value)
      },
    },

    damage: {
      get() {
        return this.item.damage
      },

      set(value) {
        this.input('damage', value)
      },
    },

    protection: {
      get() {
        return this.item.protection
      },

      set(value) {
        this.input('protection', value)
      },
    },

    tags: {
      get() {
        return this.item.tags.join(',')
      },

      set(value) {
        const tags = value.split(',').map(item => item.trim()).filter(item => item && item !== '')
        this.input('tags', tags)
      },
    },
  },
}
</script>

<style scoped lang="scss">
.item-element {
  margin-bottom: 10px;
}
</style>
