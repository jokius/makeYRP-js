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
              hint="Предпочтительно англиское название"
              @change="slugifyKey"
              :error-messages="keyError"
              :error="keyError !== ''"
            />

            <v-text-field
              v-model="damage"
              type="number"
              color="indigo"
              label="Стартовый урон"
            />

            <v-text-field
              v-model.number="hp"
              type="number"
              label="Стартовые ОЗ"
              color="indigo"
            />

            <v-text-field
              v-model.number="protection"
              type="number"
              label="Стартовая защита"
              color="indigo"
            />

            <v-text-field
              v-model.number="supply"
              type="number"
              label="Базловые припасы"
              color="indigo"
            />

            <v-text-field
              v-model.number="welfare"
              type="number"
              label="Стартоваое благосостояние"
              color="indigo"
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
      return (this.name && this.name !== '' &&
        this.key && this.key !== '' &&
        this.hp && this.hp !== '')
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

    damage: {
      get() {
        return this.role.damage
      },

      set(value) {
        this.input('damage', value)
      },
    },

    hp: {
      get() {
        return this.role.hp.max
      },

      set(value) {
        this.input('hp', { current: value, max: value })
      },
    },

    supply: {
      get() {
        return this.role.supply.max
      },

      set(value) {
        this.input('supply', { current: value, max: value })
      },
    },

    welfare: {
      get() {
        return this.role.welfare
      },

      set(value) {
        this.input('welfare', value)
      },
    },

    protection: {
      get() {
        return this.role.protection
      },

      set(value) {
        this.input('protection', value)
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

    addAppearance() {
      const list = JSON.parse(JSON.stringify(this.appearances))
      list.push('')
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
.appearance-grid {
  display: grid;
  grid-column-gap: 5px;
  grid-template-columns: 1fr max-content;
}
</style>
