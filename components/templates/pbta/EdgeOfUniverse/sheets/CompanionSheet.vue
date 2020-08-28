<template>
  <div v-if="canWrite" class="sheet-body" :style="{ width, height }">
    <v-tabs
      v-model="tab"
      color="basil"
      grow
      height="30"
    >
      <v-tab class="tab" active-class="tab-active">
        <span class="xolonium-font">О персанаже</span>
      </v-tab>
      <v-tab class="tab" active-class="tab-active">
        <span class="xolonium-font">Ходы</span>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" continuous>
      <v-tab-item>
        <companion-main-body :id="id" />
      </v-tab-item>
      <v-tab-item>
        <companion-move-body :id="id" />
      </v-tab-item>
    </v-tabs-items>
  </div>
  <div v-else class="sheet-body" :style="{ width, height }">
    <character-read-only :id="id" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import CharacterReadOnly from './CharacterReadOnly'
  import CompanionMainBody from './CompanionMainBody'
  import CompanionMoveBody from './CompanionMoveBody'

  export default {
    name: 'CompanionSheet',

    components: {
      CompanionMoveBody,
      CompanionMainBody,
      CharacterReadOnly,
    },

    props: {
      id: { type: String, required: true },
      size: { type: Object, required: true },
    },

    data() {
      return {
        tab: null,
      }
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

      canWrite: {
        get() {
          return this.sheet.acl.canWrite
        },
      },

      width: {
        get() {
          const width = this.size.width
          return typeof width === 'number' ? `${width}px` : width
        },
      },

      height: {
        get() {
          const height = this.size.height
          return typeof height === 'number' ? `${height}px` : height
        },
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .sheet-body {
    background-color: $grayC5;
    overflow: auto;
  }

  .tab {
    background-color: $gray52;
  }

  .tab-active {
    background-color: $white;
  }
</style>
