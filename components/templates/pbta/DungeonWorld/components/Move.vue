<template>
  <div class="move-block">
    <div class="title-move">
      <div v-if="!edit && canRoll" class="title-cell button">
        <span class="dice dice6 white-dice" @click="modalOpen = true">25</span>
        <span class="move-name" @click="modalOpen = true">{{ name }}</span>
      </div>
      <input
        v-else-if="edit"
        class="input"
        v-model="name"
        @change="saveSheet"
      />
      <span v-else class="move-name">{{ name }}</span>
      <v-spacer />
      <v-btn
        v-if="typeof edit !== 'undefined'"
        color="white"
        icon
        small
        class="icon-button"
        @click="edit = !edit"
      >
        <v-icon>{{ edit ? 'mdi-lock-open-variant-outline' : 'mdi-lock-outline' }}</v-icon>
      </v-btn>
      <v-btn
        v-if="move.remove"
        color="red darken-4"
        icon
        small
        dark
        class="icon-button"
        @click="removeMove"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>

    <details>
      <summary class="pointer">
        Подробнее
      </summary>
      <div v-if="edit" class="edit">
        <div>Описание</div>
        <wysiwyg v-model="description" :options="wysiwygConfig" />

        <v-select
          v-model="changeType"
          :items="stats"
          chips
          item-color="black"
          label="Характеристика для проверки"
          multiple
        />

        <div>Результат 10+</div>
        <wysiwyg v-model="full" :options="wysiwygConfig" />

        <div>Результат 7-9</div>
        <wysiwyg v-model="part" :options="wysiwygConfig" />

        <div>Результат 6-</div>
        <wysiwyg v-model="fail" :options="wysiwygConfig" />

        <div>Результат Дополнительно</div>
        <wysiwyg v-model="details" :options="wysiwygConfig" />

        <v-checkbox
          v-model="damageButton"
          color="black"
          label="Кнопка урона"
        />
      </div>
      <div v-else>
        <div class="actions">
          <v-btn
            v-if="canRoll"
            class="button-add"
            raised
            color="black"
            small
            dark
            @click="autoFull"
          >
            Авто полный успех
          </v-btn>
          <v-btn
            v-if="canRoll"
            class="button-add"
            raised
            color="black"
            small
            dark
            @click="autoPart"
          >
            Авто частичный успех
          </v-btn>
          <v-btn
            v-if="description.length > 0"
            class="button-add"
            raised
            color="black"
            small
            dark
            @click="showDescription"
          >
            Показать описание
          </v-btn>
          <div class="selects-grid">
            <div v-if="typeof move.type === 'object' && canRoll" class="type-select-grid">
              <span class="select-title">Способ</span>
              <v-select
                v-model="type"
                :items="move.type"
                class="type-select"
                color="black"
                flat
                hide-details
              />
            </div>
            <div v-if="canRoll" class="type-select-grid">
              <span class="select-title">Альтернативный способ</span>
              <v-select
                v-model="altType"
                :items="altTypes"
                class="type-select"
                color="black"
                flat
                hide-details
              />
            </div>
          </div>
        </div>
        <span class="move-description" v-html="description" />
        <div v-if="move.selects" class="selects">
          <div v-for="(select, selectIndex) in selects" :key="`other-select-${selectIndex}`">
            <v-select
              :items="select.items"
              class="other-select"
              color="black"
              :multiple="select.multiple"
              flat
              :value="select.value"
              :label="select.label"
              hide-details
              @change="value => otherSelect(selectIndex, value)"
            />
            <div>{{ selectDescription(select) }}</div>
          </div>
        </div>
      </div>
    </details>

    <roll-modifier-modal v-model="obj" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import RollModifierModal from '../modals/RollModifierModal'

  export default {
    name: 'Move',

    components: { RollModifierModal },

    props: {
      move: { type: Object, required: true },
      index: { type: Number, required: true },
      path: { type: String, required: true },
      sheet: { type: Object, required: true },
    },

    data() {
      return {
        modalOpen: false,
        enable: false,
        privateAltType: null,
        wysiwygConfig: { hideModules: { image: true, link: true } },
      }
    },

    computed: {
      ...mapState({
        tables: state => state.game.info.template.tables,
      }),

      params() {
        return this.sheet.params
      },

      canRoll() {
        return typeof this.full === 'string' && this.full.length > 0
      },

      type: {
        get() {
          return this.privateType
        },

        set(value) {
          this.privateType = value
        },
      },

      altType: {
        get() {
          return this.privateAltType || this.privateType
        },

        set(value) {
          this.privateAltType = value
        },
      },

      altTypes() {
        return this.params.stats.map(item => ({ text: item.short, value: item.type }))
      },

      edit: {
        get() {
          return this.move.edit
        },

        set(value) {
          this.input('edit', value)
        },
      },

      name: {
        get() {
          return this.move.name
        },

        set(value) {
          this.input('name', value)
        },
      },

      full: {
        get() {
          return this.move.full
        },

        set(value) {
          this.input('full', value)
        },
      },

      part: {
        get() {
          return this.move.part
        },

        set(value) {
          this.input('part', value)
        },
      },

      fail: {
        get() {
          return this.move.fail
        },

        set(value) {
          this.input('fail', value)
        },
      },

      details: {
        get() {
          return this.move.details
        },

        set(value) {
          this.input('details', value)
        },
      },

      damageButton: {
        get() {
          return this.move.damageButton
        },

        set(value) {
          this.input('damageButton', value)
        },
      },

      description: {
        get() {
          return this.move.description
        },

        set(value) {
          this.input('description', value)
        },
      },

      changeType: {
        get() {
          if (!this.move.type) return []

          if (typeof this.move.type === 'string') {
            const index = this.statesList.findIndex(item => item.type === this.move.type)
            return [index]
          } else {
            return this.move.type.map(stat => this.statesList.findIndex(item => item.type === stat.value))
          }
        },

        set(indexes) {
          if (indexes.length > 1) {
            this.input('type', this.typesByIndexes(indexes))
          } else if (indexes.length === 1) {
            this.input('type', this.typesByIndexes(indexes)[0].value)
          } else {
            this.input('type', null)
          }
        },
      },

      statesList() {
        return this.params.stats
      },

      stats() {
        return this.statesList.map((item, index) => ({
          value: index,
          text: item.short
        }))
      },

      selects: {
        get() {
          return this.move.selects || []
        },
      },

      results: {
        get() {
          return {
            full: this.move.full,
            part: this.move.part,
            fail: this.move.fail,
          }
        },
      },

      specialsStats: {
        get() {
          return this.params.specials.map(item => {
            if (item && item.type === 'stats') return item
          }).filter(Boolean)
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

      damageMod() {
        const damages = this.params.equipment.filter(item => item.enable && item.damage).map(item => item.damage)
        return Math.max(0, ...damages)
      },
    },

    created() {
      if (typeof this.move.type === 'object') {
        this.privateType = this.move.type[0].value
      } else {
        this.privateType = this.move.type
      }

      this.enable = this.move.enable
    },

    methods: {
      typesByIndexes(indexes) {
        return indexes.map(index => {
          const item = this.statesList[index]
          return { text: item.short, value: item.type }
        })
      },

      selectDescription(select) {
        return select.items[select.value]?.description || ''
      },

      otherSelect(index, value) {
        this.input(`selects[${index}].value`, value)
        this.saveSheet()
      },

      changeMove(value) {
        this.enable = value
        this.input('enable', value)
        this.saveSheet()
      },

      removeMove() {
        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: this.path,
                             value: this.index,
                             remove: true,
                           })
        this.saveSheet()
      },

      input(target, value) {
        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: `${this.path}[${this.index}].${target}`,
                             value: value,
                           })
      },

      saveSheet() {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'change',
          data: { ...this.sheet, type: 'sheet' },
        })
      },

      autoFull() {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'add',
          data: {
            type: 'message',
            body: {
              sheet: this.sheet.toChat,
              damage: this.params.damage,
              damageMod: this.damageMod,
              name: this.move.name,
              autoFull: true,
              results: this.results,
              details: this.move.details,
              damageButton: this.move.damageButton || false,
            },
          },
        })
      },

      autoPart() {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'add',
          data: {
            type: 'message',
            body: {
              sheet: this.sheet.toChat,
              damage: this.params.damage,
              damageMod: this.damageMod,
              name: this.move.name,
              autoPart: true,
              results: this.results,
              detailsAlways: this.move.detailsAlways || false,
              details: this.move.details,
              damageButton: this.move.damageButton || false,
            },
          },
        })
      },

      showDescription() {
        let description = this.move.description
        this.selects.forEach(select => {
          const item = select.items[select.value]
          description += `<div>${item.text}</div>`
          if (item.description !== '') description += `<div>${item.description}</div>`
        })

        this.$cable.perform({
          channel: 'GameChannel',
          action: 'add',
          data: {
            type: 'message',
            body: {
              sheet: this.sheet.toChat,
              name: this.move.name,
              description: description,
              showDescription: true,
            },
          },
        })
      },

      roll(modifier) {
        const stat = this.params.stats.find(item => item.type === (this.altType || this.type))
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'add',
          data: {
            type: 'message',
            body: {
              sheet: this.sheet.toChat,
              damage: this.params.damage,
              damageMod: this.damageMod,
              name: this.move.name,
              dices: { d6: 2 },
              stat,
              modifier,
              results: this.results,
              detailsAlways: this.move.detailsAlways || false,
              details: this.move.details,
              damageButton: this.move.damageButton || false,
              isMove: true,
            },
          },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
@import '~assets/css/colors';

.move-block {
  margin-bottom: 5px;
}

.title-move {
  display: grid;
  grid-template-columns: max-content 1fr repeat(2, max-content);
  background-color: $black;
  color: $white;
  line-height: 35px;
  margin-left: -5px;
}

.dice {
  font-size: 16px;
  position: relative;
  left: 5px;
  top: 2px;
}

.button {
  cursor: pointer;
  color: $white;
  &:hover,
  &:focus,
  &:active {
    color: $grayEE;
  }
}

.pointer {
  cursor: pointer;
}

.box {
  cursor: pointer;
  width: 20px;
  height: 20px;
  margin-left: 5px;
  margin-top: 7px;
  border: 2px solid $white;
}

.enable {
  background-color: $white;
  border: 2px solid $black;
}

.move-name {
  margin-left: 5px;
  min-height: 40px;
  font-weight: 600;
}

.selects-grid {
  display: grid;
  grid-row-gap: 10px;
}

.type-select-grid {
  display: grid;
  grid-template-columns: 1fr 135px;
  grid-column-gap: 10px;
  height: 35px;
}

.type-select {
  padding: 0;
  margin: 0;
  background-color: $white;
}

.selects {
  display: grid;
  grid-template-columns: 1fr;
}

.select-title {
  line-height: 35px;
}

.icon-button {
  margin-top: 4px;
}

.actions {
  display: grid;
  grid-template-columns: max-content;
  grid-row-gap: 10px;
  margin-top: 15px;
  margin-bottom: 5px;
}

.white-dice {
  background-color: $white;
  color: $black;
}

.edit {
  background: $white;
}

.input {
  color: $white;
}
</style>
