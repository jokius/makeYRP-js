<template>
  <div class="relationship-body">
    <div
      v-for="(relation, index) in relationship"
      :key="`relation-${index}`"
      class="relation"
    >
      <span class="index">{{ index + 1 }}.</span>
      <v-text-field
        :value="relation.description"
        color="indigo"
        class="relation-description"
        flat
        @input="(value) => changeRelation(value, index)"
        @change="saveSheet"
      />

      <v-btn
        color="red darken-4"
        dark
        @click="removeRelation(index)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>

    <v-btn
      color="indigo"
      dark
      small
      @click="addRelation">
      <span>Новая связь</span>
    </v-btn>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'CharacterRelationshipBody',

    props: {
      id: { type: Number, required: true },
    },

    computed: {
      ...mapState({
        sheets: state => state.game.sheets,
      }),

      sheet: {
        get() {
          return this.sheets.find(sheet => sheet.id === this.id)
        },
      },

      relationship: {
        get() {
          return this.sheet.params.relationship
        },
      },
    },

    methods: {
      addRelation() {
        const list = this.relationship.slice()
        list.push({ description: '' })
        this.$store.commit('game/updateSheetParams', { id: this.sheet.id, path: `relationship`, value: list })
      },

      changeRelation(value, index) {
        this.$store.commit('game/updateSheetParams',
          {
            id: this.sheet.id,
            path: `relationship.${index}.description`,
            value,
          })
      },

      removeRelation(index) {
        this.$store.commit('game/updateSheetParams',
          {
            id: this.sheet.id,
            path: `relationship`,
            value: index,
            remove: true,
          })
      },

      saveSheet() {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'change',
          data: { ...this.sheet, type: 'sheet' },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .relationship-body {
    background-color: $grayC5;
    overflow: auto;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: max-content;
    margin-top: 5px;
    padding: 0 5px;
  }

  .relation {
    display: grid;
    grid-template-columns: 30px 1fr max-content;
    grid-column-gap: 5px;
  }

  .relation-description {
    margin-top: -5px;
    padding: 0;
  }
</style>
