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

            <v-text-field
              v-model="key"
              label="Ключ"
              color="indigo"
              hint="Предпочтительно англиское название"
              @change="slugifyKey"
              :error-messages="keyError"
              :error="keyError !== ''"
            />

            <v-text-field
              v-model="damage"
              color="indigo"
              label="Кубик урона"
              hint="d4, d6 и тд; L - если меньшее, H - если большее"
              :error-messages="damageError"
              :error="damageError !== ''"
            />

            <v-text-field
              v-model="damageName"
              label="Название атаки"
              color="indigo"
            />

            <v-text-field
              v-model="damageTags"
              label="Теги атаки"
              color="indigo"
            />

            <v-text-field
              v-model.number="protection"
              type="number"
              label="Защита"
              color="indigo"
            />

            <v-text-field
              v-model.number="hp"
              type="number"
              label="Стартовые ОЗ"
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
              v-model="special"
              label="Особые свойства"
              color="indigo"
            />

            <v-text-field
              v-model="instinct"
              label="Инстинкт"
              color="indigo"
            />

            <div>Поведение</div>
            <div v-for="(move, index) in moves" :key="`moves-${index}`">
              <div class="item-grid">
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

            <v-text-field
              v-model="tags"
              label="теги"
              color="indigo"
            />
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

    data() {
      return {
        keyError: '',
        damageError: '',
      }
    },

    computed: {
      isValid() {
        return (this.name && this.name !== '' &&
          this.key && this.key !== '' &&
          this.hp && this.hp !== '' &&
          this.damage && this.damage !== '' && this.damage.search(dicesRegx) >= 0)
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

      key: {
        get() {
          return this.enemy.key
        },

        set(value) {
          const keyIndex = this.enemies.findIndex(item => item.key === value)
          if (keyIndex >= 0 && keyIndex !== this.currentIndex) {
            this.keyError = 'Ключ уже занят'
          } else {
            this.keyError = ''
          }

          this.input('key', value)
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

      damageName: {
        get() {
          return this.enemy.damageName
        },

        set(value) {
          this.input('damageName', value)
        },
      },

      damageTags: {
        get() {
          return this.enemy.damageTags.join(',')
        },

        set(value) {
          const tags = value.split(',').map(item => item.trim()).filter(item => item && item !== '')
          this.input('damageTags', tags)
        }
      },

      hp: {
        get() {
          return this.enemy.hp.max
        },

        set(value) {
          this.input('hp', { current: value, max: value })
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

      special: {
        get() {
          return this.enemy.special
        },

        set(value) {
          this.input('special', value)
        },
      },

      instinct: {
        get() {
          return this.enemy.instinct
        },

        set(value) {
          this.input('instinct', value)
        },
      },

      moves() {
        return this.enemy.moves
      },

      tags: {
        get() {
          return this.enemy.tags.join(',')
        },

        set(value) {
          const tags = value.split(',').map(item => item.trim()).filter(item => item && item !== '')
          this.input('tags', tags)
        }
      },
    },

    methods: {
      slugifyKey() {
        if (!this.enemy.key || this.enemy.key === '') return

        this.input('key', slugify(this.enemy.key, { replacement: '_', lower: true }))
      },

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
        this.input('selects', list)
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
