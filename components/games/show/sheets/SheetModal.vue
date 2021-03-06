<template>
  <draggable-dialog
    v-model="size"
    :on-close="onClose"
    :title="sheet.name"
    :width="size.width"
    :height="size.height"
    resizable
    name="sheet"
  >
    <template v-slot:body>
      <mutant-sheet v-if="sheetName === 'mutant_year_zero-mutant'" :id="id" :key="key" :size="size"/>
      <bid-character-sheet v-else-if="sheetName === 'blade_in_the_dark-character'" :id="id" :key="key" :size="size"/>
      <bid-team-sheet v-else-if="sheetName === 'blade_in_the_dark-team'" :id="id" :key="key" :size="size"/>
      <hmw-character-sheet
        v-else-if="sheetName === 'horror_movie_world-character'"
        :id="id"
        :key="key"
        :size="size"
      />
      <hmw-monster-sheet
        v-else-if="sheetName === 'horror_movie_world-monster'"
        :id="id"
        :key="key"
        :size="size"
      />
      <eou-character-sheet
        v-else-if="sheetName === 'edge_of_universe-character'"
        :id="id"
        :key="key"
        :size="size"
      />
      <eou-enemy-sheet
        v-else-if="sheetName === 'edge_of_universe-enemy'"
        :id="id"
        :key="key"
        :size="size"
      />
      <eou-ship-sheet
        v-else-if="sheetName === 'edge_of_universe-ship'"
        :id="id"
        :key="key"
        :size="size"
      />
      <eou-companion-sheet
        v-else-if="sheetName === 'edge_of_universe-companion'"
        :id="id"
        :key="key"
        :size="size"
      />
      <dw-character-sheet
        v-else-if="sheetName === 'dungeon_world-character'"
        :id="id"
        :key="key"
        :size="size"
      />
      <dw-enemy-sheet
        v-else-if="sheetName === 'dungeon_world-enemy'"
        :id="id"
        :key="key"
        :size="size"
      />
      <v-alert
        v-else
        :key="key"
        v-model="alert"
        dismissible
        class="alert"
        type="error"
      >
        {{ sheetName }} не существует
      </v-alert>
    </template>
  </draggable-dialog>
</template>

<script>
  import { mapState } from 'vuex'

  import DraggableDialog from '../DraggableDialog'

  export default {
    name: 'SheetModal',

    components: {
      DraggableDialog,
      EouEnemySheet: () => import('~/components/templates/pbta/EdgeOfUniverse/sheets/EnemySheet'),
      MutantSheet: () => import('~/components/templates/MYZ/sheets/MutantSheet'),
      BidCharacterSheet: () => import('~/components/templates/BladeInTheDarck/sheets/CharacterSheet'),
      BidTeamSheet: () => import('~/components/templates/BladeInTheDarck/sheets/TeamSheet'),
      HmwCharacterSheet: () => import('~/components/templates/pbta/HorrorMovieWorld/sheets/CharacterSheet'),
      HmwMonsterSheet: () => import('~/components/templates/pbta/HorrorMovieWorld/sheets/MonsterSheet'),
      EouCharacterSheet: () => import('~/components/templates/pbta/EdgeOfUniverse/sheets/CharacterSheet'),
      EouShipSheet: () => import('~/components/templates/pbta/EdgeOfUniverse/sheets/ShipSheet'),
      EouCompanionSheet: () => import('~/components/templates/pbta/EdgeOfUniverse/sheets/CompanionSheet'),
      DwCharacterSheet: () => import('~/components/templates/pbta/DungeonWorld/sheets/CharacterSheet'),
      DwEnemySheet: () => import('~/components/templates/pbta/DungeonWorld/sheets/EnemySheet'),
    },

    props: {
      uniqKey: { type: Number, required: true },
      id: { type: String, required: true },
      sheetType: { type: String, required: true },
    },

    data() {
      return {
        privateWidth: null,
        privateHeight: null,
      }
    },

    computed: {
      ...mapState({
        game: state => state.game.info,
        sheets: state => state.game.sheets,
      }),

      sheet: {
        get() {
          return this.sheets.find(sheet => sheet.id === this.id)
        },
      },

      sheetName: {
        get() {
          return `${this.game.system}-${this.sheetType}`
        },
      },

      key: {
        get() {
          return `${this.sheetName}-${this.id}`
        },
      },

      size: {
        get() {
          switch (this.sheetName) {
            case 'mutant_year_zero-mutant':
              return { width: this.privateWidth || 950, height: this.privateHeight || 600 }
            case 'blade_in_the_dark-character':
              return { width: this.privateWidth || 950, height: this.privateHeight || 600 }
            case 'blade_in_the_dark-team':
              return { width: this.privateWidth || 950, height: this.privateHeight || 600 }
            case 'horror_movie_world-character':
              return { width: this.privateWidth || 950, height: this.privateHeight || 600 }
            case 'horror_movie_world-monster':
              return { width: this.privateWidth || 950, height: this.privateHeight || 600 }
            case 'edge_of_universe-character':
              return { width: this.privateWidth || 950, height: this.privateHeight || 600 }
            case 'edge_of_universe-enemy':
              return { width: this.privateWidth || 950, height: this.privateHeight || 600 }
            case 'edge_of_universe-sheep':
              return { width: this.privateWidth || 950, height: this.privateHeight || 600 }
            case 'edge_of_universe-companion':
              return { width: this.privateWidth || 950, height: this.privateHeight || 600 }
            case 'dungeon_world-character':
              return { width: this.privateWidth || 950, height: this.privateHeight || 600 }
            case 'dungeon_world-enemy':
              return { width: this.privateWidth || 950, height: this.privateHeight || 600 }
            default:
              return { width: this.privateWidth || 950, height: this.privateHeight || 600 }
          }
        },

        set({ width, height }) {
          this.privateWidth = width
          this.privateHeight = height
        },
      },
    },

    mounted() {
      this.$cable.subscribe({
        channel: 'SheetChannel',
        sheet_id: this.id,
      })
    },

    methods: {
      onClose() {
        this.$store.commit('game/removeOpenModal', this.uniqKey)
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .whiteText {
    color: $white;
  }
</style>
