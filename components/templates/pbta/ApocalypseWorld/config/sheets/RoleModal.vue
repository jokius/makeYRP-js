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
              label="название"
              color="indigo"
            />

            <v-text-field
              v-model="key"
              label="ключ"
              color="indigo"
              hint="Предпочтительно английское название"
              @change="slugifyKey"
              :error-messages="keyError"
              :error="keyError !== ''"
            />

            <div class="list">
              <div>
                Наборы характеристик
              </div>
              <div
                v-for="(stats, index) in statsList"
                :key="`stats-${index}`"
                class="stats-grid"
              >
                <v-text-field
                  label="Круто"
                  color="indigo"
                  type="number"
                  :value="stats.cool"
                  @input="value => changeStats(index, 'cool', value)"
                />

                <v-text-field
                  label="Жёстко"
                  color="indigo"
                  type="number"
                  :value="stats.hard"
                  @input="value => changeStats(index, 'hard', value)"
                />

                <v-text-field
                  label="Пылко"
                  color="indigo"
                  type="number"
                  :value="stats.hot"
                  @input="value => changeStats(index, 'hot', value)"
                />

                <v-text-field
                  label="Умно"
                  color="indigo"
                  type="number"
                  :value="stats.sharp"
                  @input="value => changeStats(index, 'sharp', value)"
                />

                <v-text-field
                  label="Странно"
                  color="indigo"
                  type="number"
                  :value="stats.weird"
                  @input="value => changeStats(index, 'weird', value)"
                />

                <v-btn
                  class="move-select-item-remove"
                  color="red darken-4"
                  small
                  dark
                  @click="removeStats(index)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>

              <v-btn
                class="button"
                color="indigo"
                @click="addStats"
                dark
              >
                <span>Добавить набор характеристик</span>
              </v-btn>
            </div>

            <div class="list">
              <div>
                Список развития
              </div>
              <div
                v-for="(improvement, index) in improvements"
                :key="`improvements-${index}`"
                class="appearance-grid"
              >
                <v-text-field
                  label="Вариант развития"
                  color="indigo"
                  :value="improvement"
                  @input="value => changeImprovement(index, value)"
                />
                <v-btn
                  class="move-select-item-remove"
                  color="red darken-4"
                  small
                  dark
                  @click="removeImprovement(index)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>

              <v-btn
                class="button"
                color="indigo"
                @click="addImprovement"
                dark
              >
                <span>Добавить вариант развития</span>
              </v-btn>
            </div>

            <v-text-field
              v-model="names"
              color="indigo"
              label="Примеры имен"
            />

            <v-textarea
              v-model="description"
              label="описание"
              color="indigo"
              rows="2"
              auto-grow
            />

            <div
              v-for="(appearance, index) in appearances"
              :key="`appearances-${index}`"
              class="appearance-grid"
            >
              <v-text-field
                label="пример внешности"
                color="indigo"
                :value="appearance"
                @input="value => changeAppearance(index, value)"
              />
              <v-btn
                class="move-select-item-remove"
                color="red darken-4"
                small
                dark
                @click="removeAppearance(index)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>

            <v-btn
              class="button"
              color="indigo"
              @click="addAppearance"
              dark
            >
              <span>Добавить пример внешности</span>
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

export default {
  name: 'RoleModal',

  model: {
    prop: 'obj',
    event: 'changeRole',
  },

  props: {
    obj: { type: Object, required: true },
    roles: { type: Array, required: true },
  },

  data() {
    return {
      keyError: '',
    }
  },

  computed: {
    isValid() {
      return (this.name && this.name !== '' && this.key && this.key !== '')
    },

    tables() {
      return this.game.template.tables
    },

    customTables() {
      return this.game.customTemplate.tables
    },

    role() {
      return this.obj.role
    },

    name: {
      get() {
        return this.role.name
      },

      set(value) {
        this.input('name', value)
      },
    },

    key: {
      get() {
        return this.role.key
      },

      set(value) {
        const keyIndex = this.roles.findIndex(item => item.key === value)
        if (keyIndex >= 0 && keyIndex !== this.currentIndex) {
          this.keyError = 'Ключ уже занят'
        } else {
          this.keyError = ''
        }

        this.input('key', value)
      },
    },

    statsList() {
      return this.role.statsList
    },

    improvements() {
      return this.role.improvements
    },

    names: {
      get() {
        return this.role.names
      },

      set(value) {
        this.input('names', value)
      },
    },

    description: {
      get() {
        return this.role.description
      },

      set(value) {
        this.input('description', value)
      },
    },

    appearances() {
      return this.role.appearances
    },
  },

  methods: {
    addStats() {
      const list = JSON.parse(JSON.stringify(this.statsList))
      list.push({ cool: 0, hard: 0, hot: 0, sharp: 0, weird: 0 })
      this.input('statsList', list)
    },

    changeStats(index, key, value) {
      const list = JSON.parse(JSON.stringify(this.statsList))
      list[index] = { ...list[index], [key]: value }
      this.input('statsList', list)
    },

    removeStats(index) {
      const list = JSON.parse(JSON.stringify(this.statsList))
      list.splice(index, 1)
      this.input('statsList', list)
    },

    addImprovement() {
      const list = JSON.parse(JSON.stringify(this.improvements))
      list.push('')
      this.input('improvements', list)
    },

    changeImprovement(index, value) {
      const list = JSON.parse(JSON.stringify(this.improvements))
      list[index] = value
      this.input('improvements', list)
    },

    removeImprovement(index) {
      const list = JSON.parse(JSON.stringify(this.improvements))
      list.splice(index, 1)
      this.input('improvements', list)
    },

    addAppearance() {
      const list = JSON.parse(JSON.stringify(this.appearances))
      list.push('')
      this.input('appearances', list)
    },

    changeAppearance(index, value) {
      const list = JSON.parse(JSON.stringify(this.appearances))
      list[index] = value
      this.input('appearances', list)
    },

    removeAppearance(index) {
      const list = JSON.parse(JSON.stringify(this.appearances))
      list.splice(index, 1)
      this.input('appearances', list)
    },

    slugifyKey() {
      if (!this.role.key || this.role.key === '') return

      this.input('key', slugify(this.role.key, { replacement: '_', lower: true }))
    },

    input(key, value) {
      this.$set(this.role, key, value)
    },

    change() {
      if (this.isValid) {
        this.$emit('changeRole', { open: false, role: this.role })
      }
    },

    close() {
      this.$emit('changeRole', { open: false, isClose: true })
    },
  },
}
</script>

<style scoped lang="scss">
.list {
  margin-bottom: 10px;
}

.appearance-grid {
  display: grid;
  grid-column-gap: 5px;
  grid-template-columns: 1fr max-content;
}
</style>
