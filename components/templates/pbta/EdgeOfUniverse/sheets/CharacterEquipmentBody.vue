<template>
  <div class="equipment-body">
    <v-overflow-btn
      :items="items"
      label="Добавить..."
      color="black"
      segmented
      item-color="black"
      hide-details
      class="select-button"
      @change="value => add(value)"
    />

    <div class="equipments-grid">
      <equipment
        v-for="(item, index) in equipment"
        :key="`equipment-${index}`"
        :sheet="sheet"
        :item="item"
        :index="index"
        path="equipment"
      />
    </div>

    <add-starting-equipment-modal v-if="startingEquipmentOpen" v-model="startingObj" :role="params.role.key" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Pbta } from '@/lib/Pbta'
import Equipment from '@/components/templates/pbta/EdgeOfUniverse/components/Equipment'
import AddStartingEquipmentModal from '@/components/templates/pbta/EdgeOfUniverse/modals/AddStartingEquipmentModal'

export default {
  name: 'CharacterEquipmentBody',

  components: { AddStartingEquipmentModal, Equipment },

  props: {
    id: { type: String, required: true },
  },

  data() {
    return {
      panels: [],
      startingEquipmentOpen: false,
      items: [
        { text: 'Добавить стартовое снаряжение', value: 'starting', callback: () => this.add('starting') },
        { text: 'Добавить своё снаряжение', value: 'self', callback: () => this.add('self') },
      ],
    }
  },

  computed: {
    ...mapState({
      sheets: state => state.game.sheets,
      tables: state => state.game.info.template.tables,
    }),

    sheet: {
      get() {
        return this.sheets.find(sheet => sheet.id === this.id)
      },
    },

    params: {
      get() {
        return this.sheet.params
      },
    },

    equipment: {
      get() {
        return this.params.equipment
      },
    },

    startingObj: {
      get() {
        return { open: this.startingEquipmentOpen, items: [] }
      },

      set({ open, items }) {
        this.setEquipment(items)
        this.startingEquipmentOpen = open
      },
    },
  },

  methods: {
    add(type) {
      switch (type) {
        case 'starting':
          this.startingEquipmentOpen = true
          break
        case 'self':
          this.newItem()
          break
        default:
          break
      }
    },

    setEquipment(items) {
      if (items.length === 0) return

      items.forEach(item => {
        if (!item.name) return

        this.$store.commit('game/updateSheetParams',
          {
            id: this.sheet.id,
            path: `equipment[${this.equipment.length}]`,
            value: item,
          })
      })

      this.saveSheet()
    },

    newItem() {
      this.$store.commit('game/updateSheetParams',
        {
          id: this.sheet.id,
          path: `equipment[${this.equipment.length}]`,
          value: Pbta.newItem(),
        })

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

.equipment-body {
  background-color: $grayC5;
}

.equipments-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 15px;
  margin-left: 5px;
}

.actions {
  display: grid;
  grid-template-columns: 1fr max-content 10px max-content 1fr;
  margin-top: 15px;
  margin-bottom: 5px;
}
</style>
