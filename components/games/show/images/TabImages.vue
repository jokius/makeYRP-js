<template>
  <div class="grid">
    <v-btn
      class="selectButton"
      color="indigo"
      tile
      dark
      @click="openModal = true"
    >
      Управление изображениями
    </v-btn>

    <v-treeview
      v-model="tree"
      :open="open"
      :items="items"
      activatable
      item-text=""
      open-on-click
    >
      <template v-slot:prepend="{ item, open }">
        <div v-if="!item.imgChat" class="drag-part">
          <v-icon>
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>

          <div class="image-name">
            {{ item.name }}
          </div>
        </div>
        <div v-else>
          <v-tooltip left open-delay="500" content-class="preview">
            <template v-slot:activator="{ on }">
              <drag :transfer-data="{ image: item }">
                <div v-on="on" class="drag-part">
                  <v-avatar color="indigo" size="32" tile>
                    <v-img :src="item.imgChat" :alt="item.name" />
                  </v-avatar>
                  <div class="image-name">
                    {{ item.name }}
                  </div>
                </div>
              </drag>
            </template>

            <v-img :src="item.imgThumb" :alt="item.name" />
          </v-tooltip>
        </div>

      </template>
    </v-treeview>

    <folders-modal
      v-if="openModal"
      :target-obj="targetImage"
      :open-dialog="openModal"
      @close="openModal = false"
    />
  </div>
</template>

<script>
import { loadTree } from '~/api/folder'
import { FolderTreeModel } from '~/models/FolderTreeModel'
import FoldersModal from '~/components/games/show/folders/FoldersModal'

export default {
  name: 'TabImages',

  components: { FoldersModal },

  data() {
    return {
      openModal: false,
      open: [],
      tree: [],
      items: [],
      preview: null,
      position: {},
    }
  },

  computed: {
    targetImage: {
      get() {
        return {
          type: 'image',
          target: 'image',
        }
      },
    },
  },

  created() {
    this.loadTree()
  },

  watch: {
    openModal() {
      if (!this.openModal) this.loadTree()
    },
  },

  methods: {
    loadTree() {
      loadTree(this.$axios).then(raw => {
        const root = new FolderTreeModel().setInfo(raw)
        this.open = [root.id]
        this.items = [this.parseFolder(root)]
      })
    },

    parseFolder(folder) {
      const item = { id: folder.id, name: folder.name, children: [] }
      folder.children.forEach(child => item.children.push(this.parseFolder(child)))
      folder.images.forEach(image => { item.children.push(image) })

      return item
    },
  },
}
</script>

<style scoped lang="scss">
$tooltip-background-color: #000;

.grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: max-content;
  grid-row-gap: 5px;
  height: 93vh;
  overflow: auto;
}

.selectButton {
  margin: 0;
  width: auto;
}

.drag-part {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-column-gap: 5px;
}

.image-name {
  text-align: center;
  line-height: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview {
  opacity: 1 !important;
  padding: 0;
}
</style>
