<template>
  <v-dialog :value="obj.open" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или изменить связь
      </v-card-title>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-text-field
              v-model="description"
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
  export default {
    name: 'RoleRelationModal',

    model: {
      prop: 'obj',
      event: 'changeRelation',
    },

    props: {
      obj: { type: Object, required: true },
    },

    computed: {
      isValid() {
        return this.description && this.description !== ''
      },

      item() {
        return this.obj.relation
      },


      description: {
        get() {
          return this.item.description
        },

        set(value) {
          this.$set(this.item, 'description', value)
        }
      },
    },

    methods: {
      change() {
        if (this.isValid) {
          this.$emit('changeRelation', { open: false, relation: this.item })
        }
      },

      close() {
        this.$emit('changeRelation', { open: false, isClose: true })
      },
    },
  }
</script>
