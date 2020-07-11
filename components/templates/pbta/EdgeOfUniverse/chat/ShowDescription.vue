<template>
  <div class="grid-message gray-board">
    <div class="title-block gray-body">
      <span class="title-body">{{ body.name }}</span>
    </div>

    <div class="result-text" v-html="description" />
  </div>
</template>

<script>
  export default {
    name: 'ShowDescription',

    props: {
      body: { type: Object, required: true },
    },

    computed: {
      description() {
        return this.body.description
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
</style>
