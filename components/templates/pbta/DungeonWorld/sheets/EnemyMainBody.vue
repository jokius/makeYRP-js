<template>
  <div class="main-body">
    <div class="main-row1">
      <div class="main-row1-col1">
        <avatar :sheet="sheet" />
        <damage-button :sheet="sheet.toChat" :damage="damage" />
      </div>
      <div class="main-row1-col2">
        <div class="main-row1-col2-base-info">
          <v-select
            :value="enemySelect"
            :items="enemies"
            label="Стандартный противник"
            class="input name"
            color="indigo"
            @change="setEnemy"
          />
          <v-text-field
            v-model="name"
            color="indigo"
            class="input name"
            flat
            @change="saveSheet"
          />
          <div class="damage-info-grid">
            <v-text-field
              v-model="damageName"
              label="Название атаки"
              color="indigo"
            />

            <v-text-field
              v-model="damage"
              color="indigo"
              label="Кубик урона"
              hint="d4, d6 и тд; L - если меньшее, H - если большее"
              :error-messages="damageError"
              :error="damageError !== ''"
            />
          </div>
          <div class="tags-grid">
            <span class="label tag-label">Теги атаки</span>
            <v-chip-group column>
              <v-chip
                v-for="(tag, tagIndex) in damageTags"
                :key="`damage-tag-${tagIndex}`"
                close
                @click:close="removeDamageTag(tagIndex)"
              >
                {{ tag }}
              </v-chip>
            </v-chip-group>
            <v-btn
              class="tag-button"
              dark
              small
              @click="damageTagModalOpen = true"
            >
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </div>
          <div class="stats-grid">
            <v-text-field
              v-model.number="hpCurrent"
              color="indigo"
              class="input"
              label="Ранения"
              flat
              type="number"
              @change="saveSheet"
            />
            <v-text-field
              v-model.number="hpMax"
              color="indigo"
              class="input"
              label="Ранения макс"
              flat
              type="number"
              @change="saveSheet"
            />
            <v-text-field
              v-model.number="protection"
              color="indigo"
              class="input"
              label="Защита"
              flat
              type="number"
              @change="saveSheet"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="main-row2">
      <v-text-field
        v-model="special"
        color="indigo"
        class="input"
        label="Особые свойства"
        flat
        @change="saveSheet"
      />

      <v-textarea
        v-model="description"
        auto-grow
        no-resize
        rows="2"
        color="indigo"
        class="notes"
        hide-details
        label="Описание"
        @change="saveSheet"
      />

      <v-text-field
        v-model="instinct"
        color="indigo"
        class="input"
        label="Инстинкт"
        flat
        @change="saveSheet"
      />

      <div class="moves">
        <p class="moves-title">Поведение</p>
        <div v-for="(move, index) in moves" :key="`moves-${index}`">
          <div class="move-grid">
            <v-text-field
              label="Действие"
              color="indigo"
              :value="move"
              @input="value => changeMove(index, value)"
            />
            <v-btn
              color="red darken-4"
              fab
              x-small
              dark
              @click="removeMove(index)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>

        <v-btn
          class="button"
          color="indigo"
          @click="addMove"
          dark
        >
          <span>Добавить поведение</span>
        </v-btn>
      </div>

      <div class="tags-grid">
        <span class="label tag-label">Теги</span>
        <v-chip-group column>
          <v-chip
            v-for="(tag, tagIndex) in tags"
            :key="`damage-tag-${tagIndex}`"
            close
            @click:close="removeTag(tagIndex)"
          >
            {{ tag }}
          </v-chip>
        </v-chip-group>
        <v-btn
          class="tag-button"
          dark
          small
          @click="tagModalOpen = true"
        >
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Avatar from '@/components/templates/pbta/DungeonWorld/components/Avatar'

const dicesRegx = /(?:(\d+)\s*X\s*)?(\d*)D(\d*)((?:[+\/*-]\d+)|(?:[+-][LH]))?/i

export default {
  name: 'EnemyMainBody',
  components: { Avatar },
  props: {
    id: { type: Number, required: true },
  },

  data() {
    return {
      modalOpen: false,
      currentState: {},
      damageError: '',
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

    name: {
      get() {
        return this.sheet.name
      },

      set(name) {
        this.$store.commit('game/updateSheetName', { id: this.sheet.id, name })
      },
    },

    damage: {
      get() {
        return this.params.damage || 'd6'
      },

      set(value) {
        if (value.search(dicesRegx) < 0) {
          this.damageError = 'Не корректный формат'
        } else {
          this.damageError = ''
        }

        this.input('damage', value)
      },
    },

    damageName: {
      get() {
        return this.params.damageName
      },

      set(value) {
        this.input('damageName', value)
      },
    },

    damageTags: {
      get() {
        return this.params.damageTags
      },

      set(value) {
        this.input('damageTags', value)
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

    special: {
      get() {
        return this.params.special
      },

      set(value) {
        this.input('special', value)
      },
    },

    instinct: {
      get() {
        return this.params.instinct
      },

      set(value) {
        this.input('instinct', value)
      },
    },

    description: {
      get() {
        return this.params.description
      },

      set(value) {
        this.input('description', value)
      },
    },

    moves: {
      get() {
        return this.params.moves
      },

      set(value) {
        this.input('moves', value)
      }
    },

    tags: {
      get() {
        return this.params.tags
      },

      set(value) {
        this.input('tags', value)
      }
    },

    img: {
      get() {
        return this.params.img
      },

      set(value) {
        this.input('img', value)
      }
    },

    notes: {
      get() {
        return this.params.notes
      },

      set(value) {
        this.input('notes', value)
      },
    },

    enemies() {
      return this.tables.enemies.map(enemy => ({ text: enemy.name, value: enemy }))
    },

    enemySelect() {
      return this.enemies.find(enemy => enemy.value.key === this.params.key)
    },

    obj: {
      get() {
        return { open: this.modalOpen, move: {} }
      },

      set({ open, move }) {
        this.setMove(move)
        this.modalOpen = open
      },
    },
  },

  methods: {
    input(target, value) {
      this.$store.commit('game/updateSheetParams',
        {
          id: this.sheet.id,
          path: target,
          value: value,
        })
    },

    setEnemy(value) {
      console.log('value', value)
      this.name = value.name
      this.damage = value.damage
      this.damageName = value.damageName
      this.damageTags = value.damageTags
      this.protection = value.protection
      this.hp = value.hp
      this.special = value.special
      this.instinct = value.instinct
      this.instinct = value.instinct
      this.description = value.description
      this.moves = value.moves
      this.tags = value.tags
      this.img = value.img

      this.saveSheet()
    },

    addMove() {
      const list = this.moves.slice()
      list.push('')
      this.input('moves', list)

      this.saveSheet()
    },

    changeMove(index, value) {
      const list = this.moves.slice()
      list[index] = value
      this.input('moves', list)

      this.saveSheet()
    },

    removeMove(index) {
      const list = this.moves.slice()
      list.splice(index, 1)
      this.input('selects', list)

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

.main-body {
  background-color: $grayC5;
  overflow: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, max-content);
  grid-row-gap: 5px;
  height: 570px;
}

.main-row1 {
  display: grid;
  grid-template-columns: 200px 0.99fr;
  grid-template-rows: max-content;
  grid-column-gap: 10px;
  margin-right: 5px;
}

.main-row2 {
  display: grid;
  grid-template-columns: 0.99fr;
  grid-template-rows: max-content;
  margin-left: 5px;
  margin-right: 5px;
}

.damage-info-grid {
  display: grid;
  grid-template-columns: 150px max-content;
  grid-column-gap: 10px;
}

.input {
  margin: 0;
  padding: 0;
}

.name {
  margin-top: 10px;
}

.tags-grid {
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  grid-column-gap: 10px;
  line-height: 35px;
  margin-bottom: 5px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 170px);
  grid-column-gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.moves-title {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.move-grid {
  display: grid;
  grid-template-columns: 1fr 40px;
  grid-column-gap: 10px;
}

.actions {
  display: grid;
  grid-template-columns: max-content;
  justify-content: center;
}

.notes {
  margin-bottom: 15px;
}
</style>
