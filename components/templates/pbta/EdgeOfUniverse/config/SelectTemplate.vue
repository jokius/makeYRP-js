<template>
  <div class="main">
    <v-tabs
      v-model="tab"
      color="indigo"
      grow
      height="30"
    >
      <v-tab class="tab" active-class="tab-active">
        <span :class="[{ 'white--text': tab !== 0 }, 'xolonium-font']">Предметы</span>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" continuous>
      <v-tab-item>
        <items-list />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
  import ItemsList from './items/ItemsList'

  export default {
    name: 'SelectTemplate',

    components: { ItemsList },

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
