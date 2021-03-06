<template>
  <v-dialog :value="obj.open" max-width="600" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Выбрать заклинание
      </v-card-title>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-select
              v-model="group"
              :items="spellsGroups"
              color="indigo"
              label="Группа"
            />
            <v-select
              v-model="spell"
              :items="selectSpells"
              color="indigo"
              label="Заклинание"
              no-data-text="Все заклинания выбраны"
            />
          </v-col>
          <v-col cols="12">
            <span v-html="spell.description" />
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
          :disabled="!spell.name"
          color="indigo"
          @click="add"
        >
          Добавить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex'
  import { Pbta } from '../../../../../lib/Pbta'

  export default {
    name: 'AddSpellModal',

    model: {
      prop: 'obj',
      event: 'completed',
    },

    props: {
      obj: { type: Object, required: true },
      id: { type: String, required: true },
    },

    data() {
      return {
        spell: {},
        privateGroup: null,
      }
    },

    computed: {
      ...mapState({
        sheets: state => state.game.sheets,
        tables: state => state.game.info.template.tables,
      }),

      sheet() {
        return this.sheets.find(sheet => sheet.id === this.id)
      },

      params() {
        return this.sheet.params
      },

      spells() {
        return this.params.spells
      },

      role() {
        return this.params.role.key
      },

      spellsGroups() {
        return this.tables.spells[this.role].map((item, index) => ({ text: item.title, value: index }))
      },

      group: {
        get() {
          return this.privateGroup || this.spellsGroups[0].value
        },

        set(value) {
          this.privateGroup = value
        }
      },

      selectSpells() {
        const group = this.tables.spells[this.role][this.group]
        const spells = this.spells.find(spellGroup => spellGroup.title === group.title).items

        return group.items.map(item => {
          if (spells.find(spell => spell.name === item.name)) return
          const value = item
          value.remove = true

          return {
            text: item.name,
            value,
          }
        }).filter(Boolean)
      }
    },

    methods: {
      add() {
        this.$emit('completed', {
          open: false,
          spell: this.spell,
          groupTitle: this.spellsGroups[this.group].text
        })

        this.spell = {}
      },

      close() {
        this.$emit('completed', { open: false, spell: {} })
        this.spell = {}
      },
    },
  }
</script>
