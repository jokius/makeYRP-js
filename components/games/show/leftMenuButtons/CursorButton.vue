<template>
  <v-speed-dial direction="right" open-on-hover>
    <template v-slot:activator>
      <div
        v-if="!altPressed && cursor !== 'pointer'"
        :class="[{ selected: cursor === 'default' }, 'button']"
        @click="cursor = 'default'"
      >
        <v-icon class="icon">mdi-cursor-default</v-icon>
      </div>
      <div v-else :class="[{ selected: cursor === 'pointer' }, 'button']" @click="cursor = 'pointer'">
        <v-icon class="icon">mdi-cursor-pointer</v-icon>
      </div>
    </template>

    <div class="grid-items">
      <button :class="[{ selected: cursor === 'default' }, 'item']" @click="cursor = 'default'">
        <v-icon class="icon">mdi-cursor-default</v-icon>
      </button>
      <button :class="[{ selected: cursor === 'pointer' }, 'item']" @click="cursor = 'pointer'">
        <v-icon class="icon">mdi-cursor-pointer</v-icon>
      </button>
    </div>
  </v-speed-dial>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'CursorButton',

    computed: {
      ...mapState({
        currentCursor: state => state.game.currentCursor,
        altPressed: state => state.game.altPressed,
      }),

      cursor: {
        get() {
          return this.currentCursor
        },

        set(value) {
          this.$store.commit('game/changeCurrentCursor', value)
        },
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  $border: 1px solid $black;

  .button {
    width: 30px;
    height: 30px;
    background-color: $white;
    border: 1px solid $black;
    border-bottom: none;
    cursor: pointer;
  }

  .icon {
    padding-left: 2px;
    padding-top: 2px;
  }

  .grid-items {
    display: grid;
    grid-template-columns: max-content;
    margin-top: 67px;
    margin-left: -17px;
    border: $border;
    background-color: $white;
    .item:last-child {
      border-bottom: none;
    }
  }

  .item {
    padding: 5px;
    border-bottom: $border;

    &:hover {
      background-color: $indigoRGBA;
    }
  }

  .selected {
    background-color: $indigoRGBA;
  }
</style>
