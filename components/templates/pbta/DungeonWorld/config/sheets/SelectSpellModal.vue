<template>
  <v-dialog :value="obj.open" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или изменить группу
      </v-card-title>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-text-field
              v-model="title"
              label="название"
              color="indigo"
            />
            <v-checkbox
              v-model="isDefault"
              label="Все на старте"
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
    name: 'SelectSpellModal',

    model: {
      prop: 'obj',
      event: 'changeSelect',
    },

    props: {
      obj: { type: Object, required: true },
    },

    computed: {
      isValid() {
        return this.title && this.title !== ''
      },

      item() {
        return this.obj.select
      },

      title: {
        get() {
          return this.item.title
        },

        set(value) {
          this.$set(this.item, 'title', value)
        }
      },

      isDefault: {
        get() {
          return this.item.isDefault
        },

        set(value) {
          this.$set(this.item, 'isDefault', value)
        }
      },
    },

    methods: {
      change() {
        if (this.isValid) {
          this.$emit('changeSelect', {
            open: false,
            select: this.item,
            index: this.obj.index
          })
        }
      },

      close() {
        this.$emit('changeSelect', { open: false, isClose: true })
      },
    },
  }
</script>
