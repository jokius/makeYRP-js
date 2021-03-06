<template>
  <div class="grid">
    <div class="grid-title">
      <span class="title">Снаряжение</span>
      <span class="title weight">{{ weight }}</span>
    </div>
    <div class="grid-body">
      <div class="grid-item headers">
        <span>Название</span>
        <span>Кол-во</span>
        <span>Размер</span>
      </div>
      <div
        v-for="(item, index) in gear"
        :key="`gear-${index}`"
        class="grid-item"
      >
        <v-text-field
          :value="item.name"
          color="indigo"
          class="input"
          hide-details
          @input="value => input(index, 'name', value)"
          @change="saveSheet"
        />
        <v-text-field
          :value="item.number"
          color="indigo"
          class="input"
          hide-details
          type="number"
          @input="value => input(index, 'number', parseInt(value, 10) || null)"
          @change="saveSheet"
        />
        <v-select
          :value="item.size"
          :items="sizes"
          color="indigo"
          class="input"
          hide-details
          @change="value => change(index, 'size', parseFloat(value))"
        />
        <v-btn
          color="red darken-4"
          icon
          dark
          @click="remove(index)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="actions">
      <v-btn small @click="addGear('')">
        Добавить
      </v-btn>
      <span class="spacer" />
      <v-btn small @click="addScrap">
        Добавить утиль
      </v-btn>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { Myz } from '../../../../lib/Myz'

  export default {
    name: 'Gear',
    props: {
      sheet: { type: Object, required: true },
    },

    data() {
      return {
        // TODO: move it to tables
        sizes: [
          { text: 'Маленький', value: 0 },
          { text: 'Лёгкий', value: 0.5 },
          { text: 'Обычный', value: 1 },
          { text: 'Тяжёлый', value: 2 },
        ],
      }
    },

    computed: {
      ...mapState({
        tables: state => state.game.info.template.tables,
      }),

      gear: {
        get() {
          return this.sheet.params.gear
        },
      },

      weight: {
        get() {
          let currentWeight = 0
          this.gear.forEach(item =>
            currentWeight += (parseFloat(item.size) || 0) * (parseInt(item.number, 10) || 0))

          const strength = this.sheet.params.stats.find(item => item.target === 'strength')
          return `${currentWeight} / ${parseInt(strength.current, 10) * 2}`
        },
      },
    },

    methods: {
      input(index, target, value) {
        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: `gear.${index}.${target}`,
                             value: value,
                           })

      },

      change(index, target, value) {
        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: `gear.${index}.${target}`,
                             value: value,
                           })

        this.saveSheet()
      },

      remove(index) {
        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: 'gear',
                             value: index,
                             remove: true,
                           })

        this.saveSheet()
      },

      addGear(name) {
        const item = {
          name,
          number: 1,
          size: 1,
        }

        this.$store.commit('game/updateSheetParams',
                           {
                             id: this.sheet.id,
                             path: `gear.${this.gear.length}`,
                             value: item,
                           })

        this.saveSheet()
      },

      addScrap() {
        this.addGear(Myz.randomScrap(this.tables.scraps))
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

  $title_height: 35px;
  $border: 1px solid $black;

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: $title_height max-content;
  }

  .grid-title {
    display: grid;
    grid-template-columns: max-content max-content;
    background-image: url("/images/MYZ/weapon.jpeg");
    background-size: cover;
    background-color: $orangeE9;
  }

  .grid-body {
    display: grid;
    grid-template-columns: 1fr;
  }

  .grid-item {
    display: grid;
    grid-template-columns: 272px 90px 143px 40px;
  }

  .headers {
    border-bottom: $border;
  }

  .weight {
    margin-right: 2px;
  }

  .title {
    font-size: 2.5rem;
    font-weight: bold;
    color: $white;
    padding-left: 5px;
    vertical-align: middle;
    line-height: $title_height;
  }

  .text {
    vertical-align: middle;
    line-height: $title_height;
  }

  .input {
    margin: 0;
    padding: 3px 0 0;
    border-right: $border;
    background-color: $white;
  }

  .actions {
    display: grid;
    grid-template-columns: max-content auto max-content;
    grid-row-gap: 5px;
    margin: 5px;
  }
</style>
