<template>
  <div class="main">
    <v-tabs
      v-model="tab"
      color="indigo"
      grow
      height="30"
    >
      <v-tab class="tab" active-class="tab-active">
        <span :class="[{ 'white--text': tab !== 0 }, 'xolonium-font']">Листы персонажей</span>
      </v-tab>
      <v-tab class="tab" active-class="tab-active">
        <span :class="[{ 'white--text': tab !== 1 }, 'xolonium-font']">Листы противников</span>
      </v-tab>
      <v-tab class="tab" active-class="tab-active">
        <span :class="[{ 'white--text': tab !== 2 }, 'xolonium-font']">Ходы</span>
      </v-tab>
      <v-tab class="tab" active-class="tab-active">
        <span :class="[{ 'white--text': tab !== 3 }, 'xolonium-font']">Предметы</span>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" continuous>
      <v-tab-item>
        <sheets-list />
      </v-tab-item>

      <v-tab-item>
        <enemies-sheets-list />
      </v-tab-item>

      <v-tab-item>
        <moves-list />
      </v-tab-item>

      <v-tab-item>
        <items-list />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
  import SheetsList from './sheets/SheetsList'
  import MovesList from './moves/MovesList'
  import ItemsList from './items/ItemsList'
  import EnemiesSheetsList from './sheets/EnemiesSheetsList'

  export default {
    name: 'SelectTemplate',

    components: { EnemiesSheetsList, ItemsList, MovesList, SheetsList },

    data() {
      return {
        tab: null,
      }
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .tab {
    background-color: $gray52;
  }

  .tab-active {
    background-color: $white;
  }
</style>
