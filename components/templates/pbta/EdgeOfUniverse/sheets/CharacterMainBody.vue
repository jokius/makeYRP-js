<template>
  <div class="main-body">
    <div class="main-row1">
      <div class="main-row1-col1">
        <avatar :sheet="sheet" />
        <div class="two-icon-line">
          <div class="icon-block">
            <img src="/images/pbta/EdgeOfUniverse/banknote.svg" class="icon" title="Прибыль" alt="Прибыль" />
            <v-text-field
              v-model.number="profit"
              color="indigo"
              class="input"
              flat
              type="number"
              @change="saveSheet"
            />
          </div>

          <div class="icon-block">
            <img
              src="/images/pbta/EdgeOfUniverse/strongbox.svg"
              class="icon"
              title="Благосостояние"
              alt="Благосостояние"
            />
            <v-text-field
              v-model.number="welfare"
              color="indigo"
              class="input"
              flat
              type="number"
              @change="saveSheet"
            />
          </div>
        </div>
      </div>
      <div class="main-row1-col2">
        <div class="main-row1-col2-base-info">
          <v-text-field
            v-model="name"
            color="indigo"
            class="input name"
            flat
            @change="saveSheet"
          />
          <div class="role-grid">
            <v-autocomplete
              :value="role.key"
              :items="tableRoles"
              label="Роль"
              class="input"
              color="black"
              item-color="black"
              @change="(value) => role = value"
            />

            <div class="exp-grid">
              <span>EXP:</span>
              <div class="exp-boxes">
                <div
                  v-for="number in exp.max"
                  :key="`exp-${number}`"
                  class="box-line"
                  @click="exp = number"
                >
                  <div :class="[{ enable: exp.current >= number }, 'box']" />
                </div>
              </div>
              <span>Уровень:</span>
              <v-text-field
                v-model.number="level"
                color="indigo"
                class="input level"
                type="number"
                min="0"
                flat
                hide-details
                @change="saveSheet"
              />
            </div>
          </div>

          <div class="attributes">
            <div class="attributes-col1">
              <div class="state">
                <span class="state-label" @click="openModifier({ name: 'ЯРОСТЬ', value: fury })">
                  ЯРОСТЬ
                </span>
                <input
                  v-model.number="fury"
                  class="state-input"
                  type="number"
                  @change="saveSheet"
                />
              </div>
              <div class="state">
                <span class="state-label" @click="openModifier({ name: 'КОНТРОЛЬ', value: control })">
                  КОНТРОЛЬ
                </span>
                <input
                  v-model.number="control"
                  class="state-input"
                  type="number"
                  @change="saveSheet"
                />
              </div>
              <div class="state">
                <span class="state-label" @click="openModifier({ name: 'НАВЫК', value: skill })">
                  НАВЫК
                </span>
                <input
                  v-model.number="skill"
                  class="state-input"
                  type="number"
                  @change="saveSheet"
                />
              </div>
              <div class="state">
                <span class="state-label" @click="openModifier({ name: 'РЕПУТАЦИЯ', value: reputation })">
                  РЕПУТАЦИЯ
                </span>
                <input
                  v-model.number="reputation"
                  class="state-input"
                  type="number"
                  @change="saveSheet"
                />
              </div>
              <div
                v-for="raw in specialsStats"
                :key="`${raw.index}-specialsStat`"
                class="state"
              >
                <span class="state-label" @click="openModifier(specialsStat(raw))">
                  {{ raw.state.name.toUpperCase() }}
                </span>

                <input
                  class="state-input"
                  type="number"
                  :value="raw.state.current"
                  @input="changeSpecialsStat(raw, $event.target.value)"
                  @change="saveSheet"
                />
              </div>
            </div>
            <div class="attributes-col2">
              <div class="two-icon-line">
                <div class="icon-block">
                  <img src="/images/pbta/EdgeOfUniverse/fist.svg" class="icon" title="Урон" alt="Урон" />
                  <v-text-field
                    v-model.number="damage"
                    color="indigo"
                    class="input"
                    flat
                    type="number"
                    @change="saveSheet"
                  />
                </div>
                <div class="icon-block">
                  <img src="/images/pbta/EdgeOfUniverse/riot-shield.svg" class="icon" title="Защита" alt="Защита" />
                  <v-text-field
                    v-model.number="protection"
                    color="indigo"
                    class="input"
                    flat
                    type="number"
                    @change="saveSheet"
                  />
                </div>
              </div>
              <div class="two-input">
                <img src="/images/pbta/EdgeOfUniverse/health-normal.svg" class="icon" title="Здоровье" alt="Здоровье" />
                <v-text-field
                  v-model.number="hpCurrent"
                  color="indigo"
                  class="input"
                  flat
                  type="number"
                  @change="saveSheet"
                />
                <v-text-field
                  v-model.number="hpMax"
                  color="indigo"
                  class="input"
                  flat
                  type="number"
                  @change="saveSheet"
                />
              </div>
              <div class="two-input">
                <img src="/images/pbta/EdgeOfUniverse/ammo-box.svg" class="icon" title="Припасы" alt="Припасы" />
                <v-text-field
                  v-model.number="supply"
                  color="indigo"
                  class="input"
                  flat
                  type="number"
                  @change="saveSheet"
                />
                <v-text-field
                  v-model.number="supplyMax"
                  color="indigo"
                  class="input"
                  flat
                  type="number"
                  @change="saveSheet"
                />
              </div>

              <damage-button :sheet="sheet.toChat" :damage="damage" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <specials :id="id" />

    <div class="main-row2">
      <v-autocomplete
        v-model="origin"
        :items="origins"
        :label="originTitle"
        class="input"
        color="black"
        item-color="black"
        @change="saveSheet"
      />
      <div class="origin" v-html="origin" />
      <v-expansion-panels flat hover>
        <v-expansion-panel>
          <v-expansion-panel-header>Описание</v-expansion-panel-header>
          <v-expansion-panel-content>
            {{ description }}
            <br />
            <br />
            <div>Примеры внешности:</div>
            <div v-for="example in appearances" :key="example">
              <span>{{ example }}</span>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-textarea
        v-model="appearance"
        auto-grow
        no-resize
        rows="1"
        color="indigo"
        background-color="white"
        class="notes"
        hide-details
        label="Внешность"
        @change="saveSheet"
      />
      <v-textarea
        v-model="notes"
        auto-grow
        no-resize
        rows="2"
        color="indigo"
        background-color="white"
        class="notes"
        hide-details
        label="Заметки"
        @change="saveSheet"
      />
    </div>

    <roll-modifier-modal v-if="modalOpen" v-model="obj" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { get } from 'lodash'
import { Pbta } from '@/lib/Pbta'
import Avatar from '@/components/templates/pbta/EdgeOfUniverse/components/Avatar'
import DamageButton from '@/components/templates/pbta/EdgeOfUniverse/components/DamageButton'
import Specials from '@/components/templates/pbta/EdgeOfUniverse/components/Specials'
import RollModifierModal from '@/components/templates/pbta/EdgeOfUniverse/modals/RollModifierModal'

export default {
  name: 'CharacterMainBody',

  components: { RollModifierModal, Specials, DamageButton, Avatar },

  props: {
    id: { type: String, required: true },
  },

  data() {
    return {
      modalOpen: false,
      currentState: {},
    }
  },

  computed: {
    ...mapState({
      sheets: state => state.game.sheets,
      tables: state => state.game.info.template.tables,
    }),

    sheet: {
      get() {
        return this.sheets.find(sheet => sheet.id === this.id)
      },
    },

    asObj: {
      get() {
        return {
          id: this.sheet.id,
          name: this.sheet.name,
          imgChat: this.sheet.imgChat,
          damage: this.damage,
        }
      },
    },

    params: {
      get() {
        return this.sheet.params
      },
    },

    roles: {
      get() {
        return this.tables.roles
      },
    },

    name: {
      get() {
        return this.sheet.name
      },
      set(name) {
        this.$store.commit('game/updateSheetName', { id: this.sheet.id, name })
      },
    },

    role: {
      get() {
        return this.params.role
      },

      set(value) {
        this.changeRole(value)
        this.saveSheet()
      },
    },

    origins: {
      get() {
        return this.tables.origin[this.role.key].list.map(item => ({ text: item.value, value: item.description }))
      },
    },

    originTitle: {
      get() {
        return this.tables.origin[this.role.key].title
      },
    },

    origin: {
      get() {
        return this.params.origin
      },

      set(value) {
        this.input('origin', value)
      },
    },

    fury: {
      get() {
        return this.params.stats.fury
      },

      set(value) {
        this.input('stats.fury', value)
      },
    },

    control: {
      get() {
        return this.params.stats.control
      },

      set(value) {
        this.input('stats.control', value)
      },
    },

    skill: {
      get() {
        return this.params.stats.skill
      },

      set(value) {
        this.input('stats.skill', value)
      },
    },

    reputation: {
      get() {
        return this.params.stats.reputation
      },

      set(value) {
        this.input('stats.reputation', value)
      },
    },

    damage: {
      get() {
        return this.params.damage
      },

      set(value) {
        this.input('damage', value)
      },
    },

    protection: {
      get() {
        return this.params.protection
      },

      set(value) {
        this.input('protection', value)
      },
    },

    hpCurrent: {
      get() {
        return this.params.hp.current
      },

      set(value) {
        this.input('hp.current', value)
      },
    },

    hpMax: {
      get() {
        return this.params.hp.max
      },

      set(value) {
        this.input('hp.max', value)
      },
    },

    supply: {
      get() {
        return this.params.supply.current
      },

      set(value) {
        this.input('supply.current', value)
      },
    },

    supplyMax: {
      get() {
        return this.params.supply.max
      },

      set(value) {
        this.input('supply.max', value)
      },
    },

    welfare: {
      get() {
        return this.params.stats.welfare
      },

      set(value) {
        this.inputBox('stats.welfare', value, 5)
      },
    },

    profit: {
      get() {
        return this.params.profit
      },

      set(value) {
        this.inputBox('profit', value, 3)
      },
    },

    exp: {
      get() {
        return this.params.exp
      },

      set(value) {
        this.inputBox('exp.current', value, this.exp.max)
      },
    },


    level: {
      get() {
        return this.params.level
      },

      set(value) {
        this.input('level', value)
      },
    },

    tableRoles: {
      get() {
        return this.tables.roles.map(item => (
          { value: item.key, text: item.name }
        ))
      },
    },

    notes: {
      get() {
        return this.params.notes
      },

      set(value) {
        this.input('notes', value)
      },
    },

    appearances: {
      get() {
        return this.role.appearances || []
      },
    },

    appearance: {
      get() {
        return this.params.appearance
      },

      set(value) {
        this.input('appearance', value)
      },
    },

    description: {
      get() {
        return this.params.description
      },
    },

    specials: {
      get() {
        return this.params.specials || []
      },
    },

    specialsStats: {
      get() {
        return this.specials.map((item, index) => {
          if (item && item.type === 'stats') return { index: index, state: item }
        }).filter(Boolean)
      },
    },

    obj: {
      get() {
        return { open: this.modalOpen, modifier: 0 }
      },

      set({ open, modifier, isClose }) {
        if (!isClose) this.roll(parseInt(modifier))
        this.modalOpen = open
      },
    },
  },

  created() {
    if (this.params.role === '@random') {
      this.changeRole(Pbta.randomRole(this.tableRoles).value)
      this.saveSheet()
    }

    if (typeof this.params.supply.current === 'undefined') {
      const value = this.params.supply
      this.input('supply', { current: value, max: value })
      this.saveSheet()
    }

    this.updateSpecialTabs()
  },

  methods: {
    changeRole(roleName) {
      const role = this.tables.roles.find(item => item.key === roleName)
      this.input('role', role)
      this.changeStats()
      this.changeSpecials()
      this.changeMoves()
      this.changeEquipment()
      this.changeRelationship()
    },

    changeStats() {
      const role = this.tables.roles.find(item => item.key === this.role.key)

      this.$store.commit('game/updateSheetParams',
        {
          id: this.sheet.id,
          path: 'hp',
          value: role.hp,
        })

      this.$store.commit('game/updateSheetParams',
        {
          id: this.sheet.id,
          path: 'stats.welfare',
          value: role.welfare,
        })

      this.$store.commit('game/updateSheetParams',
        {
          id: this.sheet.id,
          path: 'damage',
          value: role.damage,
        })

      this.$store.commit('game/updateSheetParams',
        {
          id: this.sheet.id,
          path: 'supply',
          value: role.supply,
        })

      this.$store.commit('game/updateSheetParams',
        {
          id: this.sheet.id,
          path: 'description',
          value: role.description,
        })
    },

    changeMoves() {
      let moves = this.tables.startMoves[this.role.key] || []
      this.$store.commit('game/updateSheetParams',
        {
          id: this.sheet.id,
          path: 'moves',
          value: moves,
        })
    },

    changeEquipment() {
      let equipment = this.tables.startingEquipment[this.role.key] || []
      this.$store.commit('game/updateSheetParams',
        {
          id: this.sheet.id,
          path: 'equipment',
          value: equipment.map(item => ({ ...item, edit: false })),
        })
    },

    changeSpecials() {
      const roleSpecials = this.tables.specials[this.role.key] || []
      this.$store.commit('game/updateSheetParams',
        {
          id: this.sheet.id,
          path: 'specials',
          value: roleSpecials,
        })


      this.updateSpecialTabs()
    },

    changeRelationship() {
      const roleRelationship = this.tables.relationship[this.role.key] || []
      this.$store.commit('game/updateSheetParams',
        {
          id: this.sheet.id,
          path: 'relationship',
          value: roleRelationship,
        })
    },

    updateSpecialTabs() {
      this.$store.commit('game/updateSpecialTabs', this.specials)
    },

    specialsStat(raw) {
      const name = raw.state.name.toUpperCase()
      return { name, value: raw.state.current }
    },

    saveSheet() {
      this.$cable.perform({
        channel: 'GameChannel',
        action: 'change',
        data: { ...this.sheet, type: 'sheet' },
      })
    },

    changeSpecialsStat(raw, value) {
      this.input(`specials[${raw.index}].current`, parseInt(value, 10))
    },

    input(target, value) {
      this.$store.commit('game/updateSheetParams',
        {
          id: this.sheet.id,
          path: target,
          value: value,
        })
    },


    inputBox(target, number, max) {
      const current = get(this.params, target)
      let value = current < max ? number : 0
      value = number === current && number === 1 ? 0 : number
      this.$store.commit('game/updateSheetParams',
        {
          id: this.sheet.id,
          path: target,
          value: value,
        })

      this.saveSheet()
    },

    openModifier(state) {
      this.currentState = state
      this.modalOpen = true
    },

    roll(modifier) {
      this.$cable.perform({
        channel: 'GameChannel',
        action: 'add',
        data: {
          type: 'message',
          body: {
            sheet: this.sheet.toChat,
            name: this.currentState.name,
            dices: { d6: 2 },
            state: this.currentState,
            modifier,
            results: null,
            detailsAlways: false,
            details: null,
          },
        },
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import '~assets/css/colors';

.main-body {
  background-color: $grayC5;
  overflow: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, max-content);
  grid-row-gap: 5px;
  min-height: 570px;
}

.main-row1 {
  display: grid;
  grid-template-columns: 200px 0.99fr;
  grid-template-rows: max-content;
  grid-column-gap: 10px;
}

.main-row2 {
  display: grid;
  grid-template-columns: 0.99fr;
  grid-template-rows: max-content;
  margin-left: 5px;
}

.input {
  margin: 0;
  padding: 0;
}

.name {
  margin-top: 10px;
}

.role-grid {
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-column-gap: 10px;
}

.attributes {
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-column-gap: 15px;
}

.attributes-col1 {
  display: grid;
  grid-row-gap: 5px;
}

.attributes-col2 {
  display: grid;
  grid-row-gap: 5px;
}

.state {
  display: grid;
  grid-template-columns: 1fr 50px;
  background-color: $black;
  color: $white;
  height: 35px;
  line-height: 35px;
}

.state-label {
  cursor: pointer;
  margin-left: 10px;
}

.state-input {
  margin: 0;
  text-align: center;
  height: 35px;
  line-height: 35px;
  background-color: $white;
  color: $black;
  border: 3px solid $black;
}

.icon {
  width: 35px;
  height: 35px;
}

.box-line {
  display: inline-flex;
}

.box {
  position: relative;
  bottom: 8px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  margin-left: 5px;
  border: 2px solid $black;
  background-color: $white;
}

.black {
  background-color: $black;
  color: $white;
  text-align: center;
}

.two-icon-line {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.icon-block {
  display: grid;
  grid-template-columns: max-content 50px;
  grid-column-gap: 5px;
}

.enable {
  background-color: $black;
}

.origin {
  margin-bottom: 5px;
}

.exp-grid {
  display: grid;
  grid-template-columns: repeat(3, max-content) 50px;
  grid-column-gap: 10px;
  margin-top: 10px;
}

.exp-boxes {
  margin-top: 7px;
}

.level {
  margin-top: -5px;
}

.notes {
  margin-right: 5px;
  margin-bottom: 5px;
}

.two-input {
  display: grid;
  grid-template-columns: max-content repeat(2, 60px);
  grid-column-gap: 10px;
}
</style>
