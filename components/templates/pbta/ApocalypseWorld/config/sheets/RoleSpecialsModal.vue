<template>
  <v-dialog :value="obj.open" persistent fullscreen>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или Изменить особенности класса класс
      </v-card-title>
      <div class="actions">
        <v-overflow-btn
          :items="items"
          label="Добавить..."
          color="black"
          segmented
          item-color="black"
          hide-details
          class="add-button"
          @change="value => add(value)"
        />

        <v-btn color="indigo" class="save-button" dark @click="save">
          <span>Сохранить</span>
        </v-btn>
      </div>

      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">Название</th>
            <th class="text-left">Тип</th>
            <th class="text-left" />
          </tr>
          </thead>
          <tbody>
          <tr v-for="(special, index) in specials" :key="`specials-${index}`">
            <td>{{ special.name }}</td>
            <td>{{ typesTranslate[special.type] }}</td>
            <td class="actions cell">
              <v-btn color="indigo" dark @click="showModal({ ...special, restore: true }, special.type)">
                <span>Изменить</span>
              </v-btn>
              <v-btn
                v-if="special.remove || special.restore"
                color="red darken-4"
                fab
                x-small
                dark
                @click="removeSpecial(index)"
              >
                <v-icon v-if="special.remove">mdi-delete</v-icon>
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

    <counter-special-modal v-if="modalOpen && special.type === 'counter'" v-model="specialObj" />
    <description-special-modal v-if="modalOpen && special.type === 'description'" v-model="specialObj" />
    <select-special-modal v-if="modalOpen && special.type === 'select'" v-model="specialObj" />
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { uniqBy } from 'lodash'
import CounterSpecialModal from '~/components/templates/pbta/ApocalypseWorld/config/specials/CounterSpecialModal'
import DescriptionSpecialModal
  from '~/components/templates/pbta/ApocalypseWorld/config/specials/DescriptionSpecialModal'
import SelectSpecialModal from '@/components/templates/pbta/ApocalypseWorld/config/specials/SelectSpecialModal'

export default {
  name: 'RoleSpecialsModal',

  components: {
    SelectSpecialModal,
    DescriptionSpecialModal,
    CounterSpecialModal,
  },

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
      special: {},
      items: [
        { text: 'Добавить счётчик', value: 'counter', callback: () => this.add('counter') },
        { text: 'Добавить описание', value: 'description', callback: () => this.add('description') },
        { text: 'Добавить список', value: 'select', callback: () => this.add('select') },
      ],
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

    specials() {
      const customList = (this.customTables.specials[this.roleKey]).slice()
      const list = (this.tables.specials[this.roleKey] || []).slice()

      return uniqBy(customList.concat(list), item => item.name)
    },

    typesTranslate() {
      return this.tables.specialsTypes
    },

    specialObj: {
      get() {
        return { open: this.modalOpen, special: this.special }
      },

      set({ open, special, isClose }) {
        if (!isClose) this.changeSpecial(special)

        this.modalOpen = open
      },
    },
  },

  created() {
    if (!this.customTables.specials) {
      this.$store.commit('gameConfig/update',
        { path: `customTemplate.tables.specials`, value: {} })
    }
    if (!this.customTables.specials[this.roleKey]) {
      this.$store.commit('gameConfig/update',
        { path: `customTemplate.tables.specials.${this.roleKey}`, value: [] })
    }
  },

  methods: {
    add(type) {
      this.showModal({ remove: true }, type)
    },

    showModal(special, type) {
      this.special = { ...special, type: type }
      this.modalOpen = true
    },

    changeSpecial(special) {
      const specials = this.customTables.specials[this.roleKey].slice()
      const oldSpecialIndex = specials.findIndex(item => item.name === special.name && item.type === special.type)

      if (oldSpecialIndex >= 0) {
        specials[oldSpecialIndex] = special
      } else {
        specials.push(special)
      }

      this.$store.commit('gameConfig/update',
        { path: `customTemplate.tables.specials.${this.roleKey}`, value: specials })
    },

    removeSpecial(index) {
      this.$store.commit('gameConfig/update',
        { path: `customTemplate.tables.specials.${this.roleKey}`, value: index, remove: true })
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

.actions {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-column-gap: 10px;
  justify-content: center;
  margin-top: 5px;

  &.cell {
    justify-content: normal;
  }
}

.add-button {
  width: 400px;
  margin: 0;
}

.save-button {
  margin-top: 7px;
}
</style>
