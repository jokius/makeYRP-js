<template>
  <div v-if="canWrite" class="sheet-body" :style="{ width, height }">
    <v-tabs v-model="tab" color="basil" grow height="30">
      <v-tab :class="[{ 'white--text': tab !== 0 }, 'tab']" active-class="tab-active">
        <span class="xolonium-font">О персанаже</span>
      </v-tab>
      <v-tab :class="[{ 'white--text': tab !== 1 }, 'tab']" active-class="tab-active">
        <span class="xolonium-font">Ходы</span>
      </v-tab>
      <v-tab :class="[{ 'white--text': tab !== 2 }, 'tab']" active-class="tab-active">
        <span class="xolonium-font">Заклинания</span>
      </v-tab>
      <v-tab :class="[{ 'white--text': tab !== 3 }, 'tab']" active-class="tab-active">
        <span class="xolonium-font">Снаряжение</span>
      </v-tab>
      <v-tab :class="[{ 'white--text': tab !== 4 }, 'tab']" active-class="tab-active">
        <span class="xolonium-font">Отношения</span>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" continuous>
      <v-tab-item>
        <character-main-body :id="id" />
      </v-tab-item>

      <v-tab-item>
        <character-move-body :id="id" />
      </v-tab-item>

      <v-tab-item>
        <character-spells-body :id="id" />
      </v-tab-item>

      <v-tab-item>
        <character-equipment-body :id="id" />
      </v-tab-item>

      <v-tab-item>
        <character-relationship-body :id="id" />
      </v-tab-item>
    </v-tabs-items>
  </div>
  <div v-else class="sheet-body" :style="{ width, height }">
    <character-read-only :id="id" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import CharacterMainBody from './CharacterMainBody'
  import CharacterReadOnly from './CharacterReadOnly'
  import CharacterMoveBody from './CharacterMoveBody'
  import CharacterEquipmentBody from './CharacterEquipmentBody'
  import CharacterRelationshipBody from './CharacterRelationshipBody'
  import CharacterSpellsBody from './CharacterSpellsBody'

  export default {
    name: 'CharacterSheet',
    components: {
      CharacterSpellsBody,
      CharacterRelationshipBody,
      CharacterEquipmentBody,
      CharacterMoveBody,
      CharacterReadOnly,
      CharacterMainBody,
    },
    props: {
      id: { type: Number, required: true },
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
