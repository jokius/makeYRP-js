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
      item-key="name"
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
        <drag v-else :transfer-data="{ image: item }">
          <div class="drag-part">
            <v-avatar color="indigo" size="32" tile>
              <v-img :src="item.imgChat" :alt="item.name" />
            </v-avatar>
            <div class="image-name">
              {{ item.name }}
            </div>
          </div>
        </drag>
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
  import FoldersModal from './folders/FoldersModal'
  import { loadTree } from '../../../api/folder'
  import { FolderImageModel } from '../../../models/FolderImageModel'

  export default {
    name: 'TabImages',
    components: { FoldersModal },
    data() {
      return {
        openModal: false,
        open: [],
        tree: [],
        items: [],
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

      baseStyle: {
        get() {
          let flexDirection = 'row'
          switch (this.titlePosition) {
            case 'top':
              flexDirection = 'column'
              break
            case 'bottom':
              flexDirection = 'column-reverse'
              break
            case 'right':
              flexDirection = 'row-reverse'
              break
            default:
              break
          }

          return { display: 'flex', flexDirection }
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
        loadTree(this.$axios).then(tree => {
          this.open = [tree.name]
          this.items = [this.parseFolder(tree)]
        })
      },

      parseFolder(folder) {
        const item = { id: folder.id, name: folder.name, children: [] }
        folder.children.forEach(child => item.children.push(this.parseFolder(child)))
        folder.images.forEach(raw => item.children.push(new FolderImageModel().setInfo(raw)))
        return item
      },
    }
  }
</script>

<style scoped lang="scss">
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
</style>
