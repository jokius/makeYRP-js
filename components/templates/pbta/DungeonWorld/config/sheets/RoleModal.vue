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
              color="indigo"
              label="Кубик урона"
              hint="d4, d6 и тд"
              :error-messages="damageError"
              :error="damageError !== ''"
            />

            <v-text-field
              v-model.number="hp"
              type="number"
              label="Стартовые ОЗ"
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

  const dicesRegx = /(?:(\d+)\s*X\s*)?(\d*)D(\d*)((?:[+\/*-]\d+)|(?:[+-][LH]))?/i

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
          if (value.search(dicesRegx) < 0) {
            this.damageError = 'Не корректный формат'
          } else {
            this.damageError = ''
          }

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
    },

    methods: {
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
