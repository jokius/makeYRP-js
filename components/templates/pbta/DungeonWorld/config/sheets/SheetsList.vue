<template>
  <div class="grid">
    <div class="actions">
      <v-btn color="indigo" dark @click="showModal(emptyRole)">
        <span>Новый класс</span>
      </v-btn>

      <v-btn color="indigo" dark @click="save">
        <span>Сохранить</span>
      </v-btn>
    </div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-left">Название</th>
          <th class="text-left">Ключ</th>
          <th class="text-left" />
        </tr>
        </thead>
        <tbody>
        <tr v-for="role in roles" :key="`roles-${role.key}`">
          <td>{{ role.name }}</td>
          <td>{{ role.key }}</td>
          <td class="actions cell">
            <v-btn color="indigo" dark @click="showModal({ ...role, restore: true })">
              <span>Изменить</span>
            </v-btn>
            <v-btn
              v-if="role.remove || role.restore"
              color="red darken-4"
              fab
              x-small
              dark
              @click="removeRole(role.key)"
            >
              <v-icon v-if="role.remove">mdi-delete</v-icon>
              <v-icon v-else>mdi-restore</v-icon>
            </v-btn>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>

    <role-modal v-if="modalOpen" v-model="obj" :roles="roles" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { uniqBy } from 'lodash'
  import RoleModal from './RoleModal'

  export default {
    name: 'SheetsList',

    components: { RoleModal },

    data() {
      return {
        modalOpen: false,
        role: {},
        emptyRole: {
          key: null,
          name: null,
          hp: {
            max: null,
            current: null,
          },
          damage: null,
          remove: true,
        },
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

      roles() {
        const list = this.customTables.roles.slice()

        return uniqBy(list.concat(this.tables.roles.slice()), item => item.key)
      },

      obj: {
        get() {
          return { open: this.modalOpen, role: this.role }
        },

        set({ open, role, isClose }) {
          if (!isClose) this.changeRole(role)

          this.modalOpen = open
        },
      },
    },

    created() {
      if (!this.customTables) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables`, value: {} })
      }

      if (!this.customTables.roles) {
        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.roles`, value: [] })
      }
    },

    methods: {
      showModal(role) {
        this.role = role
        this.modalOpen = open
      },

      changeRole(role) {
        const roles = this.customTables.roles.slice()
        const oldRoleIndex = roles.findIndex(item => item.key === role.key)

        if (oldRoleIndex >= 0) {
          roles[oldRoleIndex] = role
        } else {
          roles.push(role)
        }

        this.$store.commit('gameConfig/update', { path: `customTemplate.tables.roles`, value: roles })
      },


      removeRole(key) {
        const index = this.customTables.roles.findIndex(item => item.key === key)
        if (index < 0) return

        this.$store.commit('gameConfig/update', { path: 'customTemplate.tables.roles', value: index, remove: true })
      },

      save() {
        this.$store.dispatch('gameConfig/update', { axios: this.$axios, params: this.game.params })
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
