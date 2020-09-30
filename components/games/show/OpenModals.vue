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
      <edit-text-modal
        v-else-if="modal.name === 'edit-text'"
        :key="`edit-text_${modal.key}`"
        :uniq-key="modal.key"
        :target="modal.text"
        :change="modal.change"
        :callback="modal.callback"
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
import AccessModal from '@/components/games/show/modals/AccessModal'
import RenameItemFolder from '@/components/games/show/RenameItemFolder'
import PageModal from '@/components/games/show/modals/PageModal'
import ColorPickerModal from '@/components/games/show/modals/ColorPickerModal'
import SheetModal from '@/components/games/show/sheets/SheetModal'
import InfoModal from '@/components/games/show/modals/InfoModal'
import NoteModal from '@/components/games/show/notes/NoteModal'
import EditTextModal from '@/components/games/show/modals/EditTextModal'

export default {
  name: 'OpenModals',

  components: {
    EditTextModal,
    NoteModal,
    InfoModal,
    SheetModal,
    ColorPickerModal,
    PageModal,
    RenameItemFolder,
    AccessModal,
    EouItemModal: () => import('@/components/templates/pbta/EdgeOfUniverse/modals/EouItemModal'),
    PlanetModal: () => import('@/components/templates/pbta/EdgeOfUniverse/modals/PlanetModal'),
    DwItemModal: () => import('@/components/templates/pbta/DungeonWorld/modals/DwItemModal'),
  },
  data() {
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
