<template>
  <div class="main-body">
    <div class="main-row1">
      <div class="main-row1-col1">
        <avatar :sheet="sheet" />
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
            <v-select
              :value="role.key"
              :items="tableRoles"
              label="Роль"
              class="input"
              color="indigo"
              @change="(value) => role = value"
            />
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
            </div>
            <div class="attributes-col2">
              <div class="damage">
                <img src="/images/pbta/EdgeOfUniverse/fist.svg" class="icon" title="Урон" alt="Урон" />
                <div
                  v-for="number in 5"
                  :key="`damage-${number}`"
                  class="box-line"
                  @click="damage = number"
                >
                  <div :class="[{ enable: damage >= number }, 'box']" />
                </div>
                <div>
                  <damage-button :as="asObj" :damage="damage" />
                </div>
              </div>
              <div class="protection">
                <img src="/images/pbta/EdgeOfUniverse/riot-shield.svg" class="icon" title="Защита" alt="Защита" />
                <div
                  v-for="number in 5"
                  :key="`protection-${number}`"
                  class="box-line"
                  @click="protection = number"
                >
                  <div :class="[{ enable: protection >= number }, 'box']" />
                </div>
              </div>
              <div class="hp">
                <img src="/images/pbta/EdgeOfUniverse/health-normal.svg" class="icon" title="Здоровье" alt="Здоровье" />
                <div
                  v-for="number in hp.max"
                  :key="`hp-${number}`"
                  class="box-line"
                  @click="hp = number"
                >
                  <div :class="[{ enable: hp.current >= number }, 'box']" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-row2">
      <div v-html="description" />
    </div>

    <roll-modifier-modal v-if="modalOpen" v-model="obj" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { get } from 'lodash'

  import Avatar from '../components/Avatar'

  import RollModifierModal from '../../HorrorMovieWorld/modals/RollModifierModal'
  import { Pbta } from '../../../../../lib/Pbta'
  import DamageButton from '../components/DamageButton'

  export default {
    name: 'CompanionMainBody',
    components: { DamageButton, RollModifierModal, Avatar },

    props: {
      id: { type: Number, required: true },
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
        }
      },

      params: {
        get() {
          return this.sheet.params
        },
      },

      roles: {
        get() {
          return this.tables.companions
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
          this.inputBox('damage', value, 5)
        },
      },

      protection: {
        get() {
          return this.params.protection
        },

        set(value) {
          this.inputBox('protection', value, 5)
        },
      },

      hp: {
        get() {
          return this.params.hp
        },

        set(value) {
          this.inputBox('hp.current', value, this.params.hp.max)
        },
      },

      tableRoles: {
        get() {
          return this.tables.companions.map(item => (
            { value: item.key, text: item.name }
          ))
        },
      },

      description: {
        get() {
          return this.role.description
        },
      },

      specials: {
        get() {
          return this.params.specials || []
        }
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
    },

    methods: {
      changeRole(roleName) {
        const role = this.tables.companions.find(item => item.key === roleName)
        this.input('role', role)
        this.changeStats()
      },

      changeStats() {
        const role = this.tables.companions.find(item => item.key === this.role.key)

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
      },

      saveSheet() {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'change',
          data: { ...this.sheet, type: 'sheet' },
        })
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
              as: this.sheet.id,
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

  .button-damage {
    margin-left: 5px;
  }

  .enable {
    background-color: $black;
  }

  .supply {
    display: grid;
    grid-template-columns: max-content repeat(2, 60px);
    grid-column-gap: 10px;
  }
</style>
