<template>
  <div class="main-body">
    <div class="main-row1">
      <avatar :sheet="sheet" />
      <div class="main-row1-col2">
        <div class="main-row1-col2-base-info">
          <v-select
            :value="role.key"
            :items="tableRoles"
            label="Класс"
            class="role"
            color="indigo"
            @change="(value) => role = value"
            hide-details
          />
          <v-text-field
            v-model="name"
            label="Имя"
            color="indigo"
            class="name"
            flat
            @change="saveSheet"
            hide-details
          />
          <div class="attrs-grid">
            <div class="attr-grid">
              <div class="cube-title">
                Урон
              </div>
              <div class="damage-cube button" @click="damageModalOpen = true">
                <div class="damage-text">
                  {{ damage }}
                </div>
                <div class="cube">
                  <div class="cube-face cube-face-top"></div>
                  <div class="cube-face cube-face-left"></div>
                  <div class="cube-face cube-face-right"></div>
                </div>
              </div>
              <div class="cube-after-line" />
            </div>
            <div class="attr-grid">
              <div class="shield-title">
                Броня
              </div>
              <div class="protection-value">
                <img src="/images/pbta/DungeonWorld/shield.svg" class="shield" />
                <div class="shield-text">
                  {{ protection }}
                </div>
              </div>
              <div class="shield-after-line" />
            </div>
            <div class="attr-grid">
              <div class="heart-title">
                ОЗ
              </div>
              <div class="hp-value">
                <img src="/images/pbta/DungeonWorld/heart.svg" class="heart" />
                <div class="hp-text-grid">
                  <input class="hp-input" type="number" v-model.number="hpCurrent" @change="saveSheet">
                  <div class="separator" />
                  <input class="hp-input" type="number" v-model.number="hpMax" @change="saveSheet">
                </div>
              </div>
              <div class="heart-after-line" />
            </div>
          </div>
          <div class="level-info-gird">
            <div class="level-grid">
              <div class="level-title">
                Уровень
              </div>
              <input class="level" type="number" v-model.number="level" @change="saveSheet">
              <div class="level-after-line" />
            </div>

            <div class="exp-grid">
              <div class="level-title">
                Опыт
              </div>
              <input class="level" type="number" v-model.number="exp" @change="saveSheet">
              <div class="vertical-separator" />
              <div class="level">{{ expNeed }}</div>
              <div class="level-after-line" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-row2">
      <div class="stats-grid">
        <div
          v-for="(stat, index) in stats"
          :key="`stats-${index}-${stat.type}`"
          class="state"
        >
          <div class="title-full">
            <div class="title-full-text">{{ stat.name }}</div>
          </div>
          <div class="state-body">
            <input
              type="number"
              class="state-input"
              :value="stat.value"
              @input="e => inputStat({ path: `stats[${index}].value`, oldValue: stat.value, statType: stat.type, e })"
              @change="saveSheet"
            >

            <div class="injury">
              <div class="box-line">
                <div
                  :class="[{ enable: stat.injury.enable}, 'box']"
                  @click="changeInjury(index, !stat.injury.enable)"
                />
                <div class="title-injury">
                  {{ stat.injury.name }}
                </div>
              </div>
            </div>

            <div class="stat-short" @click="openModal(stat)">
              {{ statShortValue(stat.value) }}
            </div>
          </div>
          <div class="title-short" @click="openModal(stat)">
            <div class="title-short-text">{{ stat.short }}</div>
          </div>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-block">
          <v-text-field
            v-model="alignment"
            label="Мировоззрение"
            color="indigo"
            background-color="white"
            flat
            @change="saveSheet"
            hide-details
          />

          <v-textarea
            v-model="alignmentDescription"
            auto-grow
            no-resize
            color="indigo"
            background-color="white"
            class="notes"
            hide-details
            label="Описание"
            @change="saveSheet"
          />
        </div>

        <div class="info-block">
          <v-text-field
            v-model="race"
            label="Раса"
            color="indigo"
            background-color="white"
            flat
            @change="saveSheet"
            hide-details
          />

          <v-textarea
            v-model="raceDescription"
            auto-grow
            no-resize
            color="indigo"
            background-color="white"
            class="notes"
            hide-details
            label="Описание"
            @change="saveSheet"
          />
        </div>
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
    </div>

    <roll-modifier-modal v-if="modalOpen" v-model="obj" />
    <roll-damage-modal v-if="damageModalOpen" v-model="damageObj" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import Avatar from '../components/Avatar'

  import RollModifierModal from '../modals/RollModifierModal'
  import { Pbta } from '../../../../../lib/Pbta'
  import { Dw } from '../../../../../lib/Dw'
  import RollDamageModal from '../modals/RollDamageModal'

  export default {
    name: 'CharacterMainBody',
    components: { RollDamageModal, RollModifierModal, Avatar },

    props: {
      id: { type: Number, required: true },
    },

    data() {
      return {
        modalOpen: false,
        damageModalOpen: false,
        currentStat: {},
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

      roles() {
        return this.tables.roles
      },

      name: {
        get() {
          return this.sheet.name
        },
        set(name) {
          this.$store.commit('game/updateSheetParams', { id: this.sheet.id, name })
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

      stats: {
        get() {
          return this.params.stats
        },

        set(value) {
          this.input('stats', value)
        },
      },

      damage() {
        return this.params.damage
      },

      hp: {
        get() {
          return this.params.hp
        },

        set(value) {
          this.input('hp', value)
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

      equipment() {
        return this.params.equipment
      },

      protection() {
        const protections = this.equipment
          .filter(item => item.enable && item.protection && !item.protectionAdd)
          .map(item => item.protection)

        const addProducts = this.equipment
          .filter(item => item.enable && item.protection && item.protectionAdd)
          .map(item => item.protection)

        return Math.max(0, ...protections) + Math.max(0, ...addProducts)
      },

      damageMod() {
        const damages = this.equipment.filter(item => item.enable && item.damage).map(item => item.damage)
        return Math.max(0, ...damages)
      },

      level: {
        get() {
          return this.params.level
        },

        set(value) {
          this.input('level', value)
        },
      },

      exp: {
        get() {
          return this.params.exp
        },

        set(value) {
          this.input('exp', value)
        },
      },

      expNeed() {
        return this.level + 7
      },

      tableRoles() {
        return this.roles.map(item => (
          { value: item.key, text: item.name }
        ))
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

      damageObj: {
        get() {
          return { open: this.damageModalOpen, modifier: this.damageMod }
        },

        set({ open, modifier, isClose }) {
          if (!isClose) this.rollDamage(parseInt(modifier))
          this.damageModalOpen = open
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

      alignment: {
        get() {
          return this.params.alignment
        },

        set(value) {
          this.input('alignment', value)
        },
      },

      alignmentDescription: {
        get() {
          return this.params.alignmentDescription
        },

        set(value) {
          this.input('alignmentDescription', value)
        },
      },

      race: {
        get() {
          return this.params.race
        },

        set(value) {
          this.input('race', value)
        },
      },

      raceDescription: {
        get() {
          return this.params.raceDescription
        },

        set(value) {
          this.input('raceDescription', value)
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
      openModal(stat){
        this.modalOpen = true
        this.currentStat = stat
      },

      changeRole(roleKey) {
        const role = this.roles.find(item => item.key === roleKey)
        this.input('role', role)
        this.changeAttrs()
        this.changeMoves()
        this.changeEquipment()
        this.changeRelationship()
      },

      changeAttrs() {
        const constitution = this.stats.find(item => item.type === 'constitution') || {}
        const hp = this.role.hp.max + (constitution.value || 0)

        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: 'hp',
                             value: { current: hp, max: hp },
                           })

        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: 'damage',
                             value: this.role.damage,
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
            value: equipment,
          })
      },

      changeRelationship() {
        const relationship = this.tables.relationship[this.role.key] || []
        this.$store.commit('game/updateSheetParams',
          {
            id: this.sheet.id,
            path: 'relationship',
            value: relationship,
          })
      },

      changeInjury(index, value) {
        this.$store.commit('game/updateSheetParams',
          {
            id: this.sheet.id,
            path: `stats.${index}.injury.enable`,
            value,
          })

        this.saveSheet()
      },

      statShortValue(value) {
        return Dw.statShortValue(value)
      },

      input(target, value) {
        this.$store.commit('game/updateSheetParams',
          {
            id: this.sheet.id,
            path: target,
            value: value,
          })
      },

      inputStat({ path, e, oldValue, statType }) {
        let value = null

        if (e.inputType === 'insertText') {
          if (oldValue) {
            value = parseInt(`${oldValue}${e.data}`) || null
          } else {
            value = parseInt(e.data) || null
          }
        } else {
          value = parseInt(`${oldValue}`.slice(0, -1)) || null
        }

        this.$store.commit('game/updateSheetParams', { id: this.sheet.id, path, value, })

        if (statType === 'constitution') {
          const hp = this.role.hp.max + (value || 0)

          if (this.hpCurrent === this.hpMax) {
            this.$store.commit('game/updateSheetParams', {
              id: this.sheet.id,
              path: 'hp.current',
              value: hp,
            })
          }

          this.$store.commit('game/updateSheetParams', {
            id: this.sheet.id,
            path: 'hp.max',
            value: hp,
          })
        }
      },

      saveSheet() {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'change',
          data: { ...this.sheet, type: 'sheet' },
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
              name: this.currentStat.name,
              dices: { d6: 2 },
              stat: this.currentStat,
              modifier,
            },
          },
        })
      },

      rollDamage(modifier) {
        const dices = {}
        dices[this.damage] = 1
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'add',
          data: {
            type: 'message',
            body: {
              sheet: this.sheet.toChat,
              name: 'Урон',
              dices,
              modifier,
              isDamage: true,
            },
          },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  $cube: 60px;
  $cube_half: $cube / 2;
  $cube_quarter: $cube / 4;

  input[type=number],
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -moz-appearance: textfield;
    -webkit-appearance: none;
    margin: 0;
  }

  .attrs-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-top: 20px;
    height: 105px;
  }

  .attr-grid {
    display: grid;
    height: 30px;
    grid-template-columns: 90px max-content 30px;
  }

  .cube-title {
    position: relative;
    top: $cube_quarter;
    margin-right: $cube / 6;
    height: $cube_half;
    background-color: $black;
    font-size: 14px;
    font-weight: bold;
    line-height: $cube_half;
    text-align: center;
    color: $white;
  }

  .cube-after-line {
    position: relative;
    top: $cube_quarter;
    height: $cube_half;
    margin-left: $cube / 6;
    width: 35px;
    background-color: $black;
  }

  .cube {
    width: $cube;
    height: $cube;
    position: relative;
    bottom: $cube_quarter;
    transform-style: preserve-3d;
    transform: rotateX(-45deg) rotateY(45deg);
  }

  .cube-face {
    position: absolute;
    width: $cube;
    height: $cube;
    border: 6px solid $black;
  }

  .cube-face-top {
    transform: rotateX(90deg) translateZ($cube_half);
  }

  .cube-face-left {
    transform: rotateY(-90deg) translateZ($cube_half);
    border-top: none;
    border-left: 5px solid $black;
    border-right: 3px solid $black;
  }

  .cube-face-right  {
    transform: rotateY(0deg) translateZ($cube_half);
    border-left: 3px solid $black;
    border-right: 5px solid $black;
    border-top: none;
  }

  .damage-text {
    position: relative;
    z-index: 1;
    font-size: 20px;
    font-weight: bold;
    width: $cube;
    line-height: $cube_quarter;
    text-align: center;
    cursor: default;
  }

  .shield-title {
    position: relative;
    top: 15px;
    margin-right: -17px;
    height: 30px;
    background-color: $black;
    font-size: 14px;
    font-weight: bold;
    line-height: 30px;
    text-align: center;
    color: $white;
  }

  .shield-text {
    position: relative;
    z-index: 2;
    font-size: 30px;
    font-weight: bold;
    width: 90px;
    text-align: center;
    bottom: 95px;
    cursor: default;
  }

  .shield {
    position: relative;
    bottom: 20px;
    width: 90px;
    height: 90px;
    z-index: 1;
  }

  .shield-after-line {
    position: relative;
    top: 15px;
    height: 30px;
    margin-left: -17px;
    width: 35px;
    background-color: $black;
  }

  .heart-title {
    position: relative;
    top: 15px;
    margin-right: -17px;
    height: 30px;
    background-color: $black;
    font-size: 14px;
    font-weight: bold;
    line-height: 30px;
    text-align: center;
    color: $white;
  }

  .heart-text {
    position: relative;
    z-index: 2;
    font-size: 30px;
    font-weight: bold;
    width: 90px;
    text-align: center;
    bottom: 95px;
  }

  .heart {
    position: relative;
    bottom: 19px;
    width: 140px;
    z-index: 1;
  }

  .heart-after-line {
    position: relative;
    top: 15px;
    height: 30px;
    margin-left: -17px;
    width: 35px;
    background-color: $black;
  }

  .hp-text-grid {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-rows: 25px 5px 25px;
    grid-template-columns: 140px;
    bottom: 115px;
  }

  .separator {
    width: 100%;
    height: 100%;
    background-color: $black;
  }

  .hp-input {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }

  .level-info-gird {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-column-gap: 20px;
    height: 30px;
    margin-left: 70px;
  }

  .level-grid {
    display: grid;
    grid-template-columns: 150px 50px 30px;
    background-color: $black;
  }

  .level-title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: $white;
  }

  .level {
    font-size: 20px;
    text-align: center;
    background-color: $white;
  }

  .level-after-line {
    width: 100%;
    height: 100%;
  }

  .exp-grid {
    background-color: $black;
    display: grid;
    grid-template-columns: 150px 50px 12px 50px 30px;
  }

  .vertical-separator {
    background-color: $white;
    width: 2px;
    height: 70%;
    margin: 30% 5px 15% 5px;
  }

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
    margin-left: 5px;
  }

  .stats-grid {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 145px;
    grid-column-gap: 10px;
    justify-content: center;
    margin-left: -5px;
  }

  .state {
    background-color: $black;
  }

  .title-full {
    background-color: $white;
    text-align: center;
    margin: 0 18px;
    transform: skewX(-15deg);
    position: relative;
    z-index: 2;
  }

  .title-full-text {
    transform: skewX(15deg);
  }

  .state-body {
    background-color: $white;
    z-index: 1;
    position: relative;
    width: 86%;
    margin-left: 7%;
    bottom: 5px;
  }

  .state-input {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    width: 100%;
    height: 35px;
  }

  .injury {
    background-color: $black;
    color: $white;
    text-align: center;
    padding-top: 5px;
  }

  .stat-short {
    background-color: $white;
    width: 100%;
    font-size: 35px;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
  }

  .title-short {
    font-size: 25px;
    background-color: $white;
    text-align: center;
    margin: -10px 18px 0;
    transform: skewX(-15deg);
    position: relative;
    z-index: 2;
    cursor: pointer;
  }

  .title-short-text {
    transform: skewX(15deg);
  }

  .button {
    cursor: pointer;
  }

  .number {
    font-weight: bold;
    font-size: 25px;
    margin: 0;
    text-align: center;
    height: 60px;
    line-height: 60px;
  }

  .box-line {
    display: inline-flex;
  }

  .box {
    cursor: pointer;
    width: 20px;
    height: 20px;
    margin-right: 5px;
    border: 2px solid $black;
    background-color: $white;
  }

  .enable {
    background-color: $black;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 5px;
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
