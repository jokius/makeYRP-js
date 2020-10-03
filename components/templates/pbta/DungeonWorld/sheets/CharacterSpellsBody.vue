<template>
  <div class="spells-body" :style="{ minHeight: `calc(${height} - 30px` }">
    <div class="actions">
      <v-overflow-btn
        :items="items"
        label="Добавить..."
        color="black"
        segmented
        item-color="black"
        hide-details
        @change="value => add(value)"
      />

      <v-btn
        color="black"
        icon
        class="edit-button"
        x-large
        @click="edit = !edit"
      >
        <v-icon>{{ edit ? 'mdi-lock-open-variant-outline' : 'mdi-lock-outline' }}</v-icon>
      </v-btn>
    </div>

    <template v-for="(spellGroup, indexGroup) in spells">
      <div v-if="edit" :key="`spellGroup-${indexGroup}`" class="edit-group">
        <input
          class="input"
          :value="spellGroup.title"
          @input="e => changeSpellGroup(indexGroup, e)"
          @change="saveSheet"
        />
        <v-btn
          color="red darken-4"
          icon
          small
          dark
          class="delete-button"
          @click="removeSpellGroup(indexGroup)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
      <details
        v-else-if="!edit && spellGroup.items.length > 0"
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
    <add-self-spell-modal
      v-if="selfSpellsOpen"
      :id="id"
      :obj="selfSpellObj"
      @completed="value => selfSpellObj = value"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import Spell from '~/components/templates/pbta/DungeonWorld/components/Spell'
  import AddSpellModal from '~/components/templates/pbta/DungeonWorld/modals/AddSpellModal'
  import AddOtherSpellModal from '~/components/templates/pbta/DungeonWorld/modals/AddOtherSpellModal'
  import AddSelfSpellModal from '~/components/templates/pbta/DungeonWorld/modals/AddSelfSpellModal'

  export default {
    name: 'CharacterSpellsBody',

    components: { AddSelfSpellModal, AddOtherSpellModal, AddSpellModal, Spell },

    props: {
      id: { type: String, required: true },
      height: { type: String, required: true },
    },

    data() {
      return {
        panels: [],
        spellsOpen: false,
        otherSpellsOpen: false,
        selfSpellsOpen: false,
        edit: false,
      }
    },

    computed: {
      ...mapState({
        sheets: state => state.game.sheets,
        tables: state => state.game.info.template.tables,
      }),

      items() {
        const list = []
        if (this.classSpells) {
          list.push({ text: 'Добавить заклинание', value: 'spell', callback: () => this.add('spell') })
        }

        return list.concat([
          { text: 'Добавить заклинание другого класса', value: 'other', callback: () => this.add('other') },
          { text: 'Добавить своё заклинание', value: 'selfSpell', callback: () => this.add('selfSpell') },
        ])
      },

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

      selfSpellObj: {
        get() {
          return { open: this.selfSpellsOpen }
        },

        set({ open, spell, groupTitle }) {
          this.setSpell(spell, groupTitle)
          this.selfSpellsOpen = open
        },
      },
    },

    methods: {
      changeSpellGroup(index, e) {
        const value = e.target.value
        this.$store.commit('game/updateSheetParams',
          {
            id: this.sheet.id,
            path: `spells[${index}].title`,
            value: value,
          })
      },

      removeSpellGroup(index) {
        const list = this.spells.slice()
        list.splice(index, 1)
        this.$store.commit('game/updateSheetParams',
          {
            id: this.sheet.id,
            path: `spells`,
            value: list,
          })

        this.saveSheet()
      },

      add(type) {
        switch (type) {
          case 'spell':
            this.spellsOpen = true
            break
          case 'other':
            this.otherSpellsOpen = true
            break
          case 'selfSpell':
            this.selfSpellsOpen = true
            break
          default:
            break
        }
      },

      setSpell(spell, groupTitle) {
        if (!spell.name) return

        const groupIndex = this.spells.findIndex(item => item.title === groupTitle)
        if (groupIndex < 0) {
          this.setGroup({ title: groupTitle, items: [spell] })
        } else {
          this.addSpell(groupIndex, spell)
        }

        this.saveSheet()
      },

      setGroup(group) {
        this.$store.commit('game/updateSheetParams',
          {
            id: this.sheet.id,
            path: 'spells',
            value: [...this.spells, group],
          })
      },

      addSpell(groupIndex, spell) {
        const spellIndex = this.spells[groupIndex].items.length
        this.$store.commit('game/updateSheetParams',
          {
            id: this.sheet.id,
            path: `spells[${groupIndex}].items[${spellIndex}]`,
            value: spell,
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

  .actions {
    display: grid;
    grid-template-columns: 1fr max-content;
    grid-column-gap: 10px;
  }

  .edit-button {
    margin-top: 5px;
  }

  .spells-body {
    background-color: $grayC5;
    overflow: auto;
    display: grid;
    grid-template-columns: 0.99fr;
    grid-auto-rows: max-content;
    padding: 0 5px;
  }

  .edit-group {
    display: grid;
    grid-template-columns: 1fr max-content;
  }

  .input {
    border-bottom: 1px solid $black;
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
</style>
