<template>
  <div class="specials-grid">
    <div
      v-for="(item, index) in special.items"
      :key="`special-${index}`"
      class="specials"
    >
      <v-text-field
        v-if="item.type === 'textField'"
        :value="item.value"
        :label="item.name"
        color="indigo"
        class="input name"
        flat
        hide-details
        @input="value => input(`specials[${specialIndex}].items[${index}].value`, value)"
        @change="saveSheet"
      />
      <div v-if="item.type === 'blockLine'" class="block-line">
        <div
          v-for="(block, blockIndex) in item.list"
          :key="`special-${index}-block-${blockIndex}`"
          class="block"
        >
          <div v-if="block.itemType === 'text'" class="text-black">{{ block.name }}</div>
          <v-text-field
            v-if="block.itemType === 'numberField'"
            :value="block.value"
            :label="block.name"
            color="indigo"
            class="input number"
            flat
            hide-details
            type="number"
            @input="value => input(`specials[${specialIndex}].items[${index}].list[${blockIndex}].value`, value)"
            @change="saveSheet"
          />
          <div v-if="block.itemType === 'description'" class="description" v-html="block.text" />
        </div>
      </div>
      <div v-if="item.type === 'description'" class="description" v-html="item.text" />
      <v-select
        v-if="item.type === 'select'"
        :items="item.list"
        :label="item.name"
        class="special-select"
        color="black"
        :multiple="item.multiple"
        :attach="item.multiple"
        :chips="item.multiple"
        :value="item.value"
        hide-details
        @change="value => selectSet(`specials[${specialIndex}].items[${index}].value`, value)"
      />
      <details v-if="item.type === 'block'" class="pointer">
        <summary class="black-title">{{ item.name }}</summary>
        <div class="blocks-grid">
          <div
            v-for="(block, blockIndex) in item.list"
            :key="`special-${index}-block-${blockIndex}`"
            class="block"
          >
            <div v-if="block.itemType === 'selects'" class="selects">
              <v-select
                v-for="(select, selectIndex) in block.selects"
                :key="`${index}-${selectIndex}-selects`"
                :items="select.list"
                :label="select.name"
                class="special-select"
                color="black"
                :multiple="select.multiple"
                :attach="select.multiple"
                :chips="select.multiple"
                :value="select.value"
                hide-details
                @change="value =>
                  selectSet(`specials[${specialIndex}].items[${index}].list[${blockIndex}].selects[${selectIndex}].value`,
                            value)"
              />
            </div>

            <v-select
              v-if="block.itemType === 'select'"
              :items="block.list"
              :label="block.name"
              class="special-select"
              color="black"
              :multiple="block.multiple"
              :attach="block.multiple"
              :chips="block.multiple"
              :value="block.value"
              hide-details
              @change="value => selectSet(`specials[${specialIndex}].items[${index}].list[${blockIndex}].value`, value)"
            />

            <move
              v-else-if="block.itemType === 'move'"
              :sheet="sheet"
              :move="block"
              :index="blockIndex"
              :path="`specials[${specialIndex}].items[${index}].list`"
            />
          </div>
        </div>
      </details>
      <details v-if="item.type === 'equipment'" class="pointer">
        <summary class="black-title">{{ item.name }}</summary>
        <div class="description" v-html="item.description" />
        <div class="blocks-grid">
          <equipment
            v-for="(item, blockIndex) in item.list"
            :key="`equipment-${specialIndex}-${index}-${blockIndex}`"
            :sheet="sheet"
            :item="item"
            :index="blockIndex"
            :path="`specials[${specialIndex}].items[${index}].list`"
          />
        </div>
      </details>
      <div v-if="item.type === 'counter'" class="counter">
        <div class="special-title">{{ item.name }}</div>
        <v-text-field
          :value="item.current"
          color="indigo"
          class="input name"
          flat
          hide-details
          type="number"
          @input="value => input(`specials[${specialIndex}].items[${index}].current`, value)"
          @change="saveSheet"
        />
        <v-text-field
          :value="item.max"
          color="indigo"
          class="input name"
          flat
          hide-details
          type="number"
          @input="value => input(`specials[${specialIndex}].items[${index}].max`, value)"
          @change="saveSheet"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Move from '@/components/templates/pbta/EdgeOfUniverse/components/Move'
import Equipment from '@/components/templates/pbta/EdgeOfUniverse/components/Equipment'

export default {
  name: 'TabSpecial',

  components: { Equipment, Move },

  props: {
    id: { type: String, required: true },
    specialIndex: { type: Number, required: true },
    special: { type: Object, required: true },
  },

  computed: {
    ...mapState({
      sheets: state => state.game.sheets,
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
  },

  methods: {
    input(path, value) {
      this.$store.commit('game/updateSheetParams',
        {
          id: this.sheet.id,
          path,
          value,
        })
    },

    selectSet(path, value) {
      this.$store.commit('game/updateSheetParams', { id: this.sheet.id, path, value })
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

.pointer {
  cursor: pointer;
}

.specials-grid {
  background-color: $grayC5;
  overflow: auto;
  padding: 0 5px;
  min-height: 570px;
}

.black-title {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: bold;
}

.black {
  background-color: $black;
  color: $white;
  text-align: center;
}

.blocks-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 15px;
}

.special-select {
  padding: 0;
  margin: 10px 0 10px;
  background-color: $white;
}

.block {
  margin-bottom: 15px;
}

.block-line {
  display: inline-flex;
}

.icon {
  width: 35px;
  height: 35px;
  margin-top: 10px;
}

.number {
  width: 70px;
  margin-left: 10px;
}

.text-black {
  margin-top: 17px;
  font-size: 20px;
}

.special-title {
  font-weight: bold;
  font-size: 15px;
  margin: 0;
}


.black {
  background-color: $black;
  color: $white;
  text-align: center;
}

.specials {
  margin: 10px 5px 15px;
}

.special-title {
  font-weight: bold;
  font-size: 15px;
  margin: 0;
}

.enable {
  background-color: $black;
}

.counter {
  margin: auto;
  width: 50%;
  display: grid;
  grid-template-columns: max-content 50px 50px;
  grid-column-gap: 5px;

  .special-title {
    margin-top: 5px;
  }

  .input {
    padding: 0;
    margin: 0;
  }
}
</style>
