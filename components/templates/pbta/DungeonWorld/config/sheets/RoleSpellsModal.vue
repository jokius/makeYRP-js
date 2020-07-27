<template>
  <v-dialog :value="obj.open" persistent fullscreen>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или изменить заклинания класса
      </v-card-title>

      <v-btn color="indigo" dark @click="showSelectModal(selects.length)">
        <span>Новая группа</span>
      </v-btn>

      <details v-for="select in selects" :key="`select-${select.index}`" class="spells" open>
        <summary class="spells-title">{{ select.title }}</summary>
        <div class="actions">
          <v-btn
            color="indigo"
            dark
            @click="showModal({ remove: true }, `spells.${roleKey}[${select.index}].items`)">
            <span>Новое заклинание</span>
          </v-btn>

          <v-btn color="indigo" dark @click="showSelectModal(select.index)">
            <v-icon dark>mdi-cog</v-icon>
          </v-btn>

          <v-btn
            color="red darken-4"
            dark
            @click="removeSelect(select.index)"
          >
            <v-icon dark>mdi-delete</v-icon>
          </v-btn>

          <v-btn color="indigo" dark @click="save">
            <span>Сохранить</span>
          </v-btn>
        </div>
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">Название</th>
              <th class="text-left" />
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in selectSpells[select.index].items" :key="`select-spell-${select.value}-${index}`">
              <td>{{ item.name }}</td>
              <td class="actions cell">
                <v-btn
                  color="indigo"
                  dark
                  @click="showModal({ ...item, restore: true }, `selectEquipment.${roleKey}[${select.index}].items`)">
                  <span>Изменить</span>
                </v-btn>
                <v-btn
                  v-if="item.remove || item.restore"
                  color="red darken-4"
                  fab
                  x-small
                  dark
                  @click="removeSpell(customSpellIndex(item,
                   `spells.${roleKey}[${select.index}].items`),
                    `spells.${roleKey}[${select.index}].items`)"
                >
                  <v-icon v-if="item.remove">mdi-delete</v-icon>
                  <v-icon v-else>mdi-restore</v-icon>
                </v-btn>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </details>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn
          dark
          color="indigo"
          @click="close"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>

    <role-spell-modal v-if="modalOpen" v-model="spellObj" />
    <select-spell-modal v-if="selectModalOpen" v-model="selectObj" />
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex'
  import { uniqBy, get } from 'lodash'
  import RoleSpellModal from './RoleSpellModal'
  import SelectSpellModal from './SelectSpellModal'

  export default {
    name: 'RoleSpellsModal',

    components: { SelectSpellModal, RoleSpellModal },

    model: {
      prop: 'obj',
      event: 'changeRole',
    },

    props: {
      obj: { type: Object, required: true },
      roleKey: { type: String, required: true },
    },

    data() {
      return {
        modalOpen: false,
        selectModalOpen: false,
        index: 0,
        spell: {},
        select: {},
      }
    },

    computed: {
      ...mapState({
        game: state => state.gameConfig.info,
      }),

      tables() {
        return this.game.template.tables
      },

      customTables() {
        return this.game.customTemplate.tables
      },

      selectSpells() {
        const list = this.customTables.spells[this.roleKey].slice()

        return uniqBy(list.concat((this.tables.spells[this.roleKey] || []).slice()), item => item.title)
      },

      selects() {
        return this.selectSpells.map((item, index) => ({ index, title: item.title }))
      },

      spellObj: {
        get() {
          return { open: this.modalOpen, spell: this.spell }
        },

        set({ open, spell, isClose }) {
          if (!isClose) this.changeSpell(spell)

          this.modalOpen = open
        },
      },

      selectObj: {
        get() {
          return { open: this.selectModalOpen, select: this.select, index: this.index }
        },

        set({ open, select, index, isClose }) {
          if (!isClose) this.changeSelect(select, index)

          this.selectModalOpen = open
        },
      },
    },

    created() {
      if (!this.customTables.spells) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.spells`, value: {} })
      }

      if (!this.customTables.spells[this.roleKey]) {
        this.$store.commit('gameConfig/update',
          { path: `customTemplate.tables.spells.${this.roleKey}`, value: [] })
      }
    },

    methods: {
      showModal(spell, group) {
        this.spell = spell
        this.group = group
        this.modalOpen = true
      },

      showSelectModal(index) {
        this.index = index
        this.select = { ...(this.selectSpells[index] || { title: '', items: [] }) }
        this.selectModalOpen = true
      },

      changeSpell(spell) {
        const spells = get(this.customTables, this.group).slice()
        const oldSpellIndex = spells.findIndex(item => item.name === spell.name)

        if (oldSpellIndex >= 0) {
          spells[oldSpellIndex] = spell
        } else {
          spells.push(spell)
        }

        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.${this.group}`, value: spells })
      },

      changeSelect(select, index) {
        const selects = this.selectSpells.slice()
        selects[index] = select

        this.$store.commit('gameConfig/update',
          { path: `customTemplate.tables.spells.${this.roleKey}`, value: selects })
      },

      customSpellIndex(spell, group) {
        return get(this.customTables, group).findIndex(item => item.name === spell.name)
      },

      removeSpell(index, group) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.${group}`, value: index, remove: true })
      },

      removeSelect(index) {
        this.$store.commit('gameConfig/update',
          { path: `customTemplate.tables.spells.${this.roleKey}`, value: index, remove: true })
      },

      save() {
        this.$store.dispatch('gameConfig/update', { axios: this.$axios, params: this.game.params })
      },

      close() {
        this.$emit('changeRole', { open: false })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    grid-row-gap: 5px;
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
  }

  .actions {
    display: grid;
    grid-template-columns: repeat(4, max-content);
    grid-column-gap: 5px;
    justify-content: center;
    margin-top: 5px;

    &.cell {
      justify-content: normal;
    }
  }
</style>
