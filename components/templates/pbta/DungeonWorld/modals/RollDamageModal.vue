<template>
  <v-dialog :value="obj.open" max-width="300" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Модификатор урона
      </v-card-title>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-text-field
              v-model.number="mod"
              color="indigo"
              type="number"
              flat
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
          dark
          color="indigo"
          @click="roll"
        >
          Бросить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'RollDamageModal',

    model: {
      prop: 'obj',
      event: 'roll',
    },

    props: {
      obj: { type: Object, required: true },
    },

    data() {
      return {
        mod: this.obj.modifier,
      }
    },

    methods: {
      roll() {
        this.$emit('roll', { open: false, modifier: this.mod })
        this.mod = this.obj.modifier
      },

      close() {
        this.$emit('roll', { open: false, isClose: true })
        this.mod = this.obj.modifier
      },
    },
  }
</script>
