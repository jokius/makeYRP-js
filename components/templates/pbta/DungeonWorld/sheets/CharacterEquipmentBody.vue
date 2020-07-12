<template>
  <div class="equipment-body">
    <div class="weight-info">Вес {{ currentWeight }} / {{ maxWeight }}</div>
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
    <div class="actions">
      <v-spacer />
      <v-btn
        class="button-add"
        raised
        color="black"
        dark
        @click="startingEquipmentOpen = true"
      >
        Выбрать стартовое снарежение
      </v-btn>
      <v-spacer />
      <v-btn
        class="button-add"
        raised
        color="black"
        dark
        @click="newItem"
      >
        Добавить снаряжение
      </v-btn>
      <v-spacer />
    </div>

    <add-starting-equipment-modal v-if="startingEquipmentOpen" v-model="startingObj" :role="params.role.key" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import Equipment from '../components/Equipment'

  import AddStartingEquipmentModal from '../modals/AddStartingEquipmentModal'
  import { Dw } from '../../../../../lib/Dw'

  export default {
    name: 'CharacterEquipmentBody',
    components: { AddStartingEquipmentModal, Equipment },
    props: {
      id: { type: Number, required: true },
    },

    data() {
      return {
        panels: [],
        startingEquipmentOpen: false,
      }
    },

    computed: {
      ...mapState({
        sheets: state => state.game.sheets,
        tables: state => state.game.info.template.tables,
      }),

      sheet() {
        return this.sheets.find(sheet => sheet.id === this.id)
      },

      params() {
        return this.sheet.params
      },

      equipment() {
        return this.params.equipment
      },

      currentWeight() {
        const list = this.equipment.filter(item => item.enable && item.weight)
        let accumulator = 0
        list.forEach(item => accumulator = accumulator + item.weight * (item.quantity || 1))
        return accumulator
      },

      maxWeight() {
        const value = this.params.stats.find(stat => stat.type === 'strength').value
        return Dw.statShortValue(value) + this.params.weight
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
                             value: Dw.newItem(),
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

  .weight-info {
    background-color: $black;
    color: $white;
    text-align: center;
    margin-bottom: 1px;
  }

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
