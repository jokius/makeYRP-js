<template>
  <div class="main-body">
    <div class="main-row1">
      <avatar :sheet="sheet" />
      <div class="main-row1-col2">
        <div class="main-row1-col2-base-info">
          <v-select
            :value="role.key"
            :items="tableRoles"
            label="Архетип"
            class="role"
            color="indigo"
            @change="(value) => role = value"
          />
          <v-text-field
            v-model="name"
            label="Имя"
            color="indigo"
            class="name"
            flat
            @change="saveSheet"
          />
          <div class="stat-grid">
            <div class="hp">
              <p class="stat-title">Здоровье</p>
              <div
                v-for="number in hp.max"
                :key="`hp-${number}`"
                class="box-line"
                @click="changeHp(number)"
              >
                <div :class="[{enable: hp.current >= number }, 'box']" />
              </div>
            </div>

            <div class="fear">
              <p class="stat-title">Страх</p>
              <div
                v-for="number in fear.max"
                :key="`fear-${number}`"
                class="box-line"
                @click="changeFear(number)"
              >
                <div :class="[{enable: fear.current >= number }, 'box']" />
              </div>
            </div>

            <div class="sympathy">
              <p class="stat-title">Симпатия</p>
              <div
                v-for="number in 10"
                :key="`sympathy-${number}`"
                class="box-line"
                @click="changeSympathy(number)"
              >
                <div :class="[{enable: sympathy.current >= number }, 'box']" />
              </div>
            </div>
          </div>
          <v-select
            v-model="characteristics"
            :items="characteristicsList"
            label="Характеристики"
            color="indigo"
            class="characteristics-select"
          />
        </div>
      </div>
    </div>
    <div class="main-row2">
      <div class="characteristics-grid">
        <div
          v-for="(characteristic, index) in characteristics"
          :key="`characteristics-${index}`"
          class="characteristic"
        >
          <div class="button" @click="openModal(characteristic)">
            <div class="black">
              <span class="characteristic-title-text">{{ characteristic.name }}</span>
            </div>

            <p class="number">{{ characteristic.value }}</p>
          </div>
          <div class="black">
            <v-checkbox
              :input-value="characteristic.injury.enable"
              color="white"
              class="checkbox-injury"
              :label="characteristic.injury.name"
              hide-details
              dense
              dark
              @change="(value) => changeInjury(value, index)"
            />
          </div>
        </div>
      </div>

      <div
        v-for="(special, index) in specials"
        :key="`special-${index}`"
        class="specials"
      >
        <p class="special-title">{{ special.name }}</p>
        <p class="special-description">{{ special.description }}</p>
        <v-select
          v-for="(select, selectIndex) in special.selects"
          :key="`special-select-${index}-${selectIndex}`"
          :items="select.items"
          class="special-select"
          color="black"
          :multiple="select.limit > 1"
          :attach="select.limit > 1"
          :chips="select.limit > 1"
          :value="select.value"
          :label="select.label"
          @change="value => specialSelect(index, selectIndex, value)"
        />
      </div>

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

      <div class="role-description">
        <span class="role-title">Описание:</span>
        <span class="text-description">{{ role.description }}</span>
      </div>
      <div class="role-examples">
        <span class="role-title">Примеры:</span>
        <span class="text-examples">{{ role.examples }}</span>
      </div>
    </div>

    <roll-modifier-modal v-if="modalOpen" v-model="obj" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import Avatar from './Avatar'

  import RollModifierModal from '../modals/RollModifierModal'
  import { Pbta } from '../../../../../lib/Pbta'

  export default {
    name: 'CharacterMainBody',
    components: { RollModifierModal, Avatar },

    props: {
      id: { type: Number, required: true },
    },

    data() {
      return {
        modalOpen: false,
        currentCharacteristic: {},
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
          this.$store.commit('game/updateSheetParams', { id: this.sheet.id, name })
        },
      },

      characteristicsList: {
        get() {
          return this.tables.characteristics[this.role.key]
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

      selectCharacteristics: {
        get() {
          return this.params.characteristics.map(item => {
            item.injury.enable = false
            return item
          })
        },

        set(value) {
          this.input('characteristics', value)
        },
      },

      characteristics: {
        get() {
          return this.params.characteristics
        },

        set(value) {
          this.input('characteristics', value)
        },
      },

      hp: {
        get() {
          return this.params.hp
        },

        set(value) {
          this.input('hp', value)
        },
      },

      sympathy: {
        get() {
          return this.params.sympathy
        },

        set(value) {
          this.input('sympathy', value)
        },
      },

      fear: {
        get() {
          return this.params.fear
        },

        set(value) {
          this.input('fear', value)
        },
      },

      specials: {
        get() {
          return this.params.specials
        },
      },

      tableRoles: {
        get() {
          return this.tables.roles.map(item => (
            { value: item.key, text: item.name }
          ))
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

      notes: {
        get() {
          return this.sheet.params.notes
        },

        set(value) {
          this.input('notes', value)
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
      openModal(characteristic){
        this.modalOpen = true
        this.currentCharacteristic = characteristic
      },

      changeRole(roleName) {
        const role = this.tables.roles.find(item => item.key === roleName)
        this.input('role', role)
        this.changeCharacteristic(roleName)
        this.changeStats(roleName)
        this.changeRelationship(roleName)
        this.changeMoves(roleName)
        this.changeSpecials(roleName)
      },

      changeRelationship(role) {
        const roleRelationship = this.tables.relationship[role] || []
        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: 'relationship',
                             value: roleRelationship,
                           })
      },

      changeMoves(role) {
        const roleMoves = this.tables.moves[role] || []
        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: 'moves',
                             value: roleMoves,
                           })

        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: 'fearMove',
                             value: this.tables.fearMove[role] || "",
                           })

        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: 'deadMove',
                             value: this.tables.deadMove[role] || "",
                           })
      },

      changeCharacteristic(role) {
        const roleCharacteristics = this.tables.characteristics[role] || []
        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: 'characteristics',
                             value: roleCharacteristics[0].value,
                           })
      },

      changeSpecials(role) {
        const roleSpecials = this.tables.specials[role] || []
        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: 'specials',
                             value: roleSpecials,
                           })
      },

      changeHp(number) {
        let value = this.hp.current < this.hp.max ? number : 0
        value = number === this.hp.current && number === 1 ? 0 : number
        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: `hp.current`,
                             value,
                           })

        this.saveSheet()
      },

      changeFear(number) {
        let value = this.fear.current < this.fear.max ? number : 0
        value = number === this.fear.current && number === 1 ? 0 : number
        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: `fear.current`,
                             value,
                           })

        this.saveSheet()
      },

      changeSympathy(number) {
        let value = this.sympathy.current < 10 ? number : 0
        value = number === this.sympathy.current && number === 1 ? 0 : number
        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: `sympathy.current`,
                             value,
                           })

        this.saveSheet()
      },

      specialSelect(index, selectIndex, value) {
        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: `specials[${index}].selects[${selectIndex}].value`,
                             value,
                           })

        this.saveSheet()
      },

      changeStats(role) {
        const roleStats = this.tables.stats[role] || []

        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: 'hp',
                             value: roleStats.hp,
                           })

        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: 'fear',
                             value: roleStats.fear,
                           })

        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: 'sympathy',
                             value: roleStats.sympathy,
                           })

        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: 'fearMove',
                             value: roleStats.fearMove,
                           })

        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: 'deadMove',
                             value: roleStats.deadMove,
                           })
      },

      changeInjury(value, index) {
        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: `characteristics.${index}.injury.enable`,
                             value,
                           })

        this.saveSheet()
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

      roll(modifier) {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'add',
          data: {
            type: 'message',
            body: {
              sheet: this.sheet.toChat,
              name: this.currentCharacteristic.name,
              dices: { d6: 2 },
              characteristic: this.currentCharacteristic,
              modifier,
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
    grid-template-rows: 260px max-content;
    grid-row-gap: 5px;
    height: 570px;
  }

  .main-row1 {
    display: grid;
    grid-template-columns: 200px 0.99fr;
    grid-template-rows: max-content;
    grid-column-gap: 10px;
  }

  .main-row2 {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: max-content;
    margin-left: 5px;
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .characteristics-grid {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 20px;
    margin-right: 5px;
    height: 127px;
  }

  .characteristic {
    background: $white;
    border: 1px solid $black;
  }

  .characteristic-title-text {
    font-size: 25px;
  }

  .button {
    cursor: pointer;
  }

  .black {
    background-color: $black;
    color: $white;
    text-align: center;
  }

  .number {
    font-weight: bold;
    font-size: 25px;
    margin: 0;
    text-align: center;
    height: 60px;
    line-height: 60px;
  }

  .checkbox-injury {
    margin: 0;
  }

  .box-line {
    display: inline-flex;
  }

  .box {
    cursor: pointer;
    width: 15px;
    height: 15px;
    margin-left: 5px;
    border: 2px solid $black;
    background-color: $white;
  }

  .enable {
    background-color: $black;
  }

  .characteristics-select {
    height: 20px;
  }

  .specials {
    margin-top: 10px;
    margin-left: 5px;
    margin-right: 5px;
    width: 99%;
  }

  .special-title {
    font-weight: bold;
    font-size: 25px;
    margin: 0;
  }

  .special-select {
    margin: 0;
  }

  .notes {
    margin-right: 5px;
    margin-bottom: 5px;
  }

  .role-title {
    margin-right: 2px;
    font-weight: bold;
    font-style: italic;
  }
</style>
