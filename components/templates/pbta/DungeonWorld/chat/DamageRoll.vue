<template>
  <div class="grid-message gray-board">
    <div class="title-block gray-body">
      <span class="title-body">Урон</span>
    </div>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <p class="number" v-on="on">{{ damage }}</p>
      </template>
      <div v-html="fullResult" />
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
      results: {
        get() {
          return this.body.results
        },
      },

      dices() {
        return this.body.dices
      },

      modifier() {
        return this.body.modifier || 0
      },

      fullResult() {
        let pull = []
        for (const key in this.dices) {
          pull = pull.concat(this.dices[key])
        }

        let message = `<div>бросок: ${pull.join('+')}</div>`
        message += `<div>модификатор: ${this.modifier}</div>`

        return message
      },

      damage() {
        let result = 0
        for (const key in this.dices) {
          result += this.dices[key].reduce((accumulator, item) => accumulator + item)
        }

        return result + this.modifier
      },
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
