<template>
  <v-dialog :value="obj.open" persistent fullscreen>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или удалить связи класса
      </v-card-title>

      <div class="actions">
        <v-btn
          color="indigo"
          dark
          @click="showModal({ description: '', remove: true })">
          <span>Новая связь</span>
        </v-btn>

        <v-btn color="indigo" dark @click="save">
          <span>Сохранить</span>
        </v-btn>
      </div>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">Описание</th>
            <th class="text-left" />
          </tr>
          </thead>
          <tbody>
          <tr v-for="(relation, index) in relationship" :key="`relationship-${index}`">
            <td>{{ relation.description }}</td>
            <td class="actions cell">
              <v-btn
                v-if="relation.remove || relation.restore"
                color="red darken-4"
                fab
                x-small
                dark
                @click="removeRelation(customRelationIndex(relation))"
              >
                <v-icon v-if="relation.remove">mdi-delete</v-icon>
                <v-icon v-else>mdi-restore</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>

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

    <role-relation-modal v-if="modalOpen" v-model="relationObj" />
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex'
  import { uniqBy, get } from 'lodash'
  import RoleRelationModal from './RoleRelationModal'

  export default {
    name: 'RoleRelationshipModal',

    components: { RoleRelationModal },

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

      relationship() {
        const list = this.customTables.relationship[this.roleKey].slice()

        return uniqBy(list
          .concat((this.tables.relationship[this.roleKey] || [])
          .slice()), item => item.description)
      },

      relationObj: {
        get() {
          return { open: this.modalOpen, relation: this.relation }
        },

        set({ open, relation, isClose }) {
          if (!isClose) this.addRelation(relation)

          this.modalOpen = open
        },
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
        this.$store.commit('gameConfig/update',
          { path: `customTemplate.tables.relationship.${this.roleKey}`, value: [] })
      }
    },

    methods: {
      showModal(relation) {
        this.relation = relation
        this.modalOpen = true
      },

      addRelation(relation) {
        const relationship = get(this.customTables, `relationship.${this.roleKey}`).slice()
        relationship.push(relation)

        this.$store.commit('gameConfig/update',
          { path: `customTemplate.tables.relationship.${this.roleKey}`, value: relationship })
      },

      customRelationIndex(relation) {
        return get(this.customTables, `relationship.${this.roleKey}`)
                .findIndex(item => item.name === relation.name)
      },

      removeRelation(index) {
        this.$store.commit('gameConfig/update',
          { path: `customTemplate.tables.relationship.${this.roleKey}`, value: index, remove: true })
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
