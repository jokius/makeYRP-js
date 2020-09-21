<template>
  <v-dialog :value="obj.open" persistent fullscreen>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или Изменить класс
      </v-card-title>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-text-field
              v-model="name"
              label="Название"
              color="indigo"
            />

            <v-textarea
              v-model="description"
              auto-grow
              no-resize
              rows="2"
              color="indigo"
              label="Описание"
            />

            <v-text-field
              v-model.number="damage"
              color="indigo"
              label="Урон"
              type="number"
            />

            <v-text-field
              v-model.number="protection"
              type="number"
              label="Защита"
              color="indigo"
            />

            <v-text-field
              v-model.number="woundsMax"
              type="number"
              label="Стартовое здоровье"
              color="indigo"
            />

            <div>Ходы</div>
            <div v-for="(move, index) in moves" :key="`moves-${index}`">
              <div class="item-grid">
                <v-text-field
                  label="Ход"
                  color="indigo"
                  :value="move"
                  @input="value => changeMove(index, value)"
                />
                <v-btn
                  class="button-icon"
                  color="red darken-4"
                  small
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
              <span>Добавить ход</span>
            </v-btn>
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
          :disabled="!isValid"
          color="indigo"
          @click="change"
        >
          <span :class="{ 'white--text': isValid }">Сохранить</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import slugify from 'slugify'
  import { dicesRegx } from '@/lib/dicesRegx'

  export default {
    name: 'EnemyModal',

    model: {
      prop: 'obj',
      event: 'changeEnemy',
    },

    props: {
      obj: { type: Object, required: true },
      enemies: { type: Array, required: true },
    },

    computed: {
      isValid() {
        return (this.name && this.name !== '' &&
          this.damage && this.damage !== '' &&
          this.woundsMax && this.woundsMax !== '')
      },

      enemy() {
        return this.obj.enemy
      },

      name: {
        get() {
          return this.enemy.name
        },

        set(value) {
          this.input('name', value)
        },
      },

      damage: {
        get() {
          return this.enemy.damage
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

      protection: {
        get() {
          return this.enemy.protection
        },

        set(value) {
          this.input('protection', value)
        },
      },

      description: {
        get() {
          return this.enemy.description
        },

        set(value) {
          this.input('description', value)
        },
      },

      woundsMax: {
        get() {
          return this.enemy.woundsMax
        },

        set(value) {
          this.input('woundsMax', value)
        },
      },

      moves() {
        return this.enemy.moves
      },
    },

    methods: {
      addMove() {
        const list = this.moves.slice()
        list.push('')
        this.input('moves', list)
      },

      changeMove(index, value) {
        const list = this.moves.slice()
        list[index] = value
        this.input('moves', list)
      },

      removeMove(index) {
        const list = this.moves.slice()
        list.splice(index, 1)
        this.input('moves', list)
      },

      input(key, value) {
        this.$set(this.enemy, key, value)
      },

      change() {
        if (this.isValid) {
          this.$emit('changeEnemy', { open: false, enemy: this.enemy })
        }
      },

      close() {
        this.$emit('changeEnemy', { open: false, isClose: true })
      },
    },
  }
</script>

<style scoped lang="scss">
.item-grid {
  display: grid;
  grid-template-columns: 1fr max-content;
}

.button-icon {
  margin-top: 20px;
}
</style>
