<template>
  <v-dialog :value="obj.open" persistent fullscreen>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        История
      </v-card-title>

      <div class="actions">
        <v-btn color="indigo" dark @click="save">
          <span>Сохранить</span>
        </v-btn>
      </div>
      <div>
        В свой ход
      </div>

      <v-text-field
        v-model="selfFirst"
        label="описание"
        color="indigo"
      />
      <v-text-field
        v-model="selfSecond"
        label="описание"
        color="indigo"
      />
      <v-text-field
        v-model="selfThird"
        label="описание"
        color="indigo"
      />
      <v-text-field
        v-model="selfAll"
        label="описание"
        color="indigo"
      />

      <div>
        В ходы других
      </div>

      <v-text-field
        v-model="other"
        label="описание"
        color="indigo"
      />

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn
          dark
          color="indigo"
          @click="close"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'RoleRelationshipModal',

  model: {
    prop: 'obj',
    event: 'changeRole',
  },

  props: {
    obj: { type: Object, required: true },
    roleKey: { type: String, required: true },
  },

  data() {
    return {
      modalOpen: false,
      relation: {},
    }
  },

  computed: {
    ...mapState({
      game: state => state.gameConfig.info,
    }),

    tables() {
      return this.game.template.tables
    },

    customTables() {
      return this.game.customTemplate.tables
    },

    selfFirst: {
      get() {
        const value = this.customTables.relationship[this.roleKey].self[0]
        return value || this.tables.relationship?.[this.roleKey]?.self?.[0]
      },

      set(value) {
        this.input('self[0]', value)
      }
    },

    selfSecond: {
      get() {
        const value = this.customTables.relationship[this.roleKey].self[1]
        return value || this.tables.relationship?.[this.roleKey]?.self?.[1]
      },

      set(value) {
        this.input('self[1]', value)
      }
    },

    selfThird: {
      get() {
        const value = this.customTables.relationship[this.roleKey].self[2]
        return value || this.tables.relationship?.[this.roleKey]?.self?.[2]
      },

      set(value) {
        this.input('self[2]', value)
      }
    },

    selfAll: {
      get() {
        const value = this.customTables.relationship[this.roleKey].self[3]
        return value || this.tables.relationship?.[this.roleKey]?.self?.[3]
      },

      set(value) {
        this.input('self[3]', value)
      }
    },

    other: {
      get() {
        const value = this.customTables.relationship[this.roleKey].other
        return value || this.tables.relationship?.[this.roleKey]?.other
      },

      set(value) {
        this.input('other', value)
      }
    },
  },

  created() {
    if (!this.customTables) {
      this.$store.commit('gameConfig/update', { path: `customTemplate.tables`, value: {} })
    }

    if (!this.customTables.relationship) {
      this.$store.commit('gameConfig/update', { path: `customTemplate.tables.relationship`, value: {} })
    }

    if (!this.customTables.relationship[this.roleKey]) {
      const value = { self: [null, null, null], other: '' }
      this.$store.commit('gameConfig/update',
        { path: `customTemplate.tables.relationship.${this.roleKey}`, value })
    }
  },

  methods: {
    input(key, value) {
      this.$store.commit('gameConfig/update',
        { path: `customTemplate.tables.relationship.${this.roleKey}.${key}`, value: value })
    },

    save() {
      this.$store.dispatch('gameConfig/update', { axios: this.$axios, params: this.game.params })
    },

    close() {
      this.$emit('changeRole', { open: false })
    },
  },
}
</script>

<style scoped lang="scss">
@import '~assets/css/colors';

.grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto;
  grid-row-gap: 5px;
}

.items {
  cursor: pointer;
  margin-bottom: 5px;
}

.items-title {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: bold;
}

.actions {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-column-gap: 5px;
  justify-content: center;
  margin-top: 5px;

  &.cell {
    justify-content: normal;
  }
}
</style>
