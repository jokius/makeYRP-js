<template>
  <v-dialog :value="obj.open" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или Изменить текстовое поле
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
              v-model="value"
              label="название"
              color="indigo"
              :type="type"
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
export default {
  name: 'TextFieldSpecialModal',

  model: {
    prop: 'obj',
    event: 'changeSpecial',
  },

  props: {
    obj: { type: Object, required: true },
    type: { type: String, required: true },
  },

  computed: {
    isValid() {
      return (this.name && this.name !== '')
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

    value: {
      get() {
        return this.special.value
      },

      set(value) {
        let result
        if (this.type === 'text') {
          result = value ||''
        } else {
         result = parseInt(value, 10) || 0
        }

        this.input('value', result)
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
          special: { ...this.special },
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
