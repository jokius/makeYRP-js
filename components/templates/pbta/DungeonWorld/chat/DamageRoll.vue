<template>
  <div class="grid-message gray-board">
    <div class="title-block gray-body">
      <span class="title-body">{{ damageName }}</span>
    </div>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <p class="number" v-on="on">{{ damage }}</p>
      </template>
      <div>бросок: {{ dices }}</div>
    </v-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'DamageRoll',

    props: {
      body: { type: Object, required: true },
    },

    computed: {
      dices() {
        return this.body.dices_string
      },

      damage() {
        return this.body.dices.result
      },

      damageName() {
        return this.body.name || 'Урон'
      }
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  $border: 3px solid $black;
  $size: 60px;

  .grid-message {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    grid-row-gap: 5px;
    background: $white;
  }

  .gray-board {
    border: 1px solid $gray42;
  }

  .title-block {
    color: $white;
    text-align: center;
  }

  .title-body {
    font-size: 20px;
  }

  .gray-body {
    background-color: $gray42;
  }

  .number {
    font-weight: bold;
    font-size: 25px;
    margin: 0;
    text-align: center;
    height: 60px;
    line-height: 60px;
  }

  .result-text {
    margin: 0 5px;
  }

  .details-text {
    margin-top: 5px;
    margin-left: 5px;
    margin-right: 5px;
  }
</style>
