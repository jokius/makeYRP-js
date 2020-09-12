<template>
  <v-dialog :value="obj.open" max-width="600" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Выбрать ход
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

            <v-text-field
              v-model="group"
              label="Новая группа"
              color="indigo"
            />

            <v-text-field
              v-model="name"
              label="Название"
              color="indigo"
            />

            <div>Описание</div>
            <wysiwyg v-model="description" :options="wysiwygConfig" />
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
          :disabled="!name"
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
  import { Dw } from '~/lib/Dw'

  export default {
    name: 'AddSelfSpellModal',

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
        group: '',
        name: '',
        description: '',
        wysiwygConfig: { hideModules: { image: true, link: true } },
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

      spellsGroups() {
        return this.spells.map(item => item.title)
      },
    },

    methods: {
      add() {
        const spell = Dw.newSpell(this.name, this.description)
        this.$emit('completed', {
          open: false,
          spell: spell,
          groupTitle: this.group
        })
        this.clear()
      },

      close() {
        this.$emit('completed', { open: false, spell: {} })
        this.clear()
      },

      clear() {
        this.name = ''
        this.description = ''
        this.group = ''
      }
    },
  }
</script>
