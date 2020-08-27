<template>
  <div>
    <template v-for="modal in openModals">
      <page-modal v-if="modal.name === 'page'" :key="`page_${modal.key}`" :uniq-key="modal.key" />
      <access-modal
        v-else-if="modal.name === 'access'"
        :key="`access_${modal.key}`"
        :uniq-key="modal.key"
        :obj="modal.obj"
      />

      <color-picker-modal
        v-else-if="modal.name === 'color-picker'"
        :key="`color-picker_${modal.key}`"
        :uniq-key="modal.key"
        :target="modal.target"
        :start-color="modal.startColor"
      />
      <rename-item-folder
        v-else-if="modal.name === 'rename-item-folder'"
        :key="`rename-item-folder_${modal.key}`"
        :uniq-key="modal.key"
        :id="modal.id"
        :parent-id="modal.parentId"
        :is-new="modal.isNew"
        :old-name="modal.oldName"
      />
      <sheet-modal
        v-else-if="modal.name === 'sheet'"
        :id="modal.id"
        :key="`sheet_${modal.key}`"
        :uniq-key="modal.key"
        :sheet-type="modal.sheetType"
      />
      <info-modal
        v-else-if="modal.name === 'info'"
        :id="modal.id"
        :key="`info_${modal.key}`"
        :uniq-key="modal.key"
        :title="modal.title"
        :description="modal.description"
      />
      <note-modal
        v-else-if="modal.name === 'note'"
        :key="`note_${modal.key}`"
        :uniq-key="modal.key"
        :is-edit="modal.isEdit"
        :is-new="modal.isNew"
        :note="modal.note"
      />
      <planet-modal
        v-else-if="modal.name === 'planet'"
        :key="`planet_${modal.key}`"
        :uniq-key="modal.key"
        :is-edit="modal.isEdit"
        :is-new="modal.isNew"
        :planet="modal.planet"
      />
      <eou-item-modal
        v-else-if="modal.name === 'eou-item'"
        :key="`item_${modal.key}`"
        :uniq-key="modal.key"
        :item="modal.item"
      />
      <dw-item-modal
        v-else-if="modal.name === 'dw-item'"
        :key="`item_${modal.key}`"
        :uniq-key="modal.key"
        :item="modal.item"
      />
      <v-alert
        v-else
        :key="modal.key"
        v-model="alert"
        dismissible
        class="alert"
        type="error"
      >
        {{ modal.name }} не существует
      </v-alert>
    </template>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import ColorPickerModal from './ColorPickerModal'
  import SheetModal from './SheetModal'
  import InfoModal from './InfoModal'
  import NoteModal from './NoteModal'
  import PageModal from './PageModal'
  import AccessModal from '@/components/games/show/AccessModal'
  import RenameItemFolder from '@/components/games/show/RenameItemFolder'

  export default {
    name: 'OpenModals',

    components: {
      RenameItemFolder,
      AccessModal,
      EouItemModal: () => import('../../templates/pbta/EdgeOfUniverse/modals/EouItemModal'),
      PlanetModal: () => import('../../templates/pbta/EdgeOfUniverse/modals/PlanetModal'),
      DwItemModal: () => import('../../templates/pbta/DungeonWorld/modals/DwItemModal'),
      NoteModal,
      InfoModal,
      SheetModal,
      ColorPickerModal,
      PageModal
    },
    data () {
      return {
        alert: true,
      }
    },
    computed: {
      ...mapState({
        openModals: state => state.game.openModals,
      }),
    },
  }
</script>

<style scoped lang="scss">
  .alert {
    width: 100vw;
    position: absolute;
    z-index: 999999;
  }
</style>
