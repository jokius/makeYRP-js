<template>
  <div class="spells-body">
    <div class="actions">
      <v-btn
        v-if="classSpells"
        class="button-add"
        raised
        color="black"
        dark
        @click="spellsOpen = true"
      >
        Добавить заклинание
      </v-btn>
      <v-spacer />
      <v-btn
        class="button-add"
        raised
        color="black"
        dark
        @click="otherSpellsOpen = true"
      >
        Добавить заклинание другого класса
      </v-btn>
    </div>

    <template v-for="(spellGroup, indexGroup) in spells">
      <details
        v-if="spellGroup.items.length > 0"
        :key="`spellGroup-${indexGroup}`"
        class="spells"
        open
      >
        <summary class="spells-title">{{ spellGroup.title }}</summary>
        <div class="spells-grid">
          <spell
            v-for="(spell, index) in spellGroup.items"
            :key="`spells-${index}`"
            :sheet="sheet"
            :spell="spell"
            :index="index"
            :path="`spells[${indexGroup}].items`"
          />
        </div>
      </details>
    </template>

    <add-spell-modal
      v-if="spellsOpen"
      :id="id"
      :obj="spellObj"
      @completed="value => spellObj = value"
    />
    <add-other-spell-modal
      v-if="otherSpellsOpen"
      :id="id"
      :obj="otherSpellObj"
      @completed="value => otherSpellObj = value"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import Spell from '../components/Spell'
  import AddSpellModal from '../modals/AddSpellModal'
  import AddOtherSpellModal from '../modals/AddOtherSpellModal'

  export default {
    name: 'CharacterSpellsBody',

    components: { AddOtherSpellModal, AddSpellModal, Spell },

    props: {
      id: { type: Number, required: true },
    },

    data() {
      return {
        panels: [],
        spellsOpen: false,
        otherSpellsOpen: false,
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

      classSpells() {
        return (this.tables.spells[this.params.role.key] || []).length > 0
      },

      spellObj: {
        get() {
          return { open: this.spellsOpen, spell: {} }
        },

        set({ open, spell, groupTitle }) {
          this.setSpell(spell, groupTitle)
          this.spellsOpen = open
        },
      },

      otherSpellObj: {
        get() {
          return { open: this.otherSpellsOpen, spell: {} }
        },

        set({ open, spell, groupTitle }) {
          this.setSpell(spell, groupTitle)
          this.otherSpellsOpen = open
        },
      },
    },

    methods: {
      setSpell(spell, groupTitle) {
        if (!spell.name) return

        const spellIndex = this.spells.findIndex(item => item.title === groupTitle)
        if (spellIndex < 0) {
          const group = { title: groupTitle, items: [spell] }
          this.$store.commit('game/updateSheetParams',
            {
              id: this.sheet.id,
              path: 'spells',
              value: [...this.spells, group],
            })
        } else {
          this.$store.commit('game/updateSheetParams',
            {
              id: this.sheet.id,
              path: `spells[${spellIndex}].items[${this.spells[spellIndex].items.length}]`,
              value: spell,
            })
        }

        this.saveSheet()
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

  .spells-body {
    background-color: $grayC5;
    overflow: auto;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: max-content;
    padding: 0 5px;
  }

  .spells {
    cursor: pointer;
    margin-bottom: 5px;
  }

  .spells-title {
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }

  .spells-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 15px;
  }

  .gray {
    background-color: $grayC5;
  }

  .actions {
    display: grid;
    grid-template-columns: max-content 10px max-content 10px max-content;
    justify-content: center;
    margin-top: 15px;
    margin-bottom: 5px;
  }
</style>
