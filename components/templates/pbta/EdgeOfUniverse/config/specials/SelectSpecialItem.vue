<template>
  <div class="item-element">
    <div class="item-first-row">
      <v-text-field
        label="название"
        color="indigo"
        v-model="text"
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

    <div>Описание</div>
    <wysiwyg v-model="value" />
  </div>
</template>

<script>
export default {
  name: 'SelectSpecialItem',

  props: {
    item: { type: Object, required: true },
    input: { type: Function, required: true },
    remove: { type: Function, required: true },
  },

  computed: {
    text: {
      get() {
        return this.item.text
      },

      set(value) {
        this.input('text', value)
      },
    },

    value: {
      get() {
        return this.item.value
      },

      set(value) {
        this.input('value', value)
      },
    },
  },
}
</script>

<style scoped lang="scss">
.item-element {
  margin-bottom: 10px;
}

.item-first-row {
  display: grid;
  grid-column-gap: 5px;
  grid-template-columns: 1fr max-content;
}

.item-remove {
  position: relative;
  top: 25%;
}
</style>
