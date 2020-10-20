<template>
  <div>
    <v-overflow-btn
      v-if="user.id === master.id"
      class="selectButton"
      :items="items"
      label="Создать..."
      color="indigo"
      segmented
      item-color="indigo"
      hide-details
      @change="value => add(value)"
    />

    <clocks-folder :folder="menu.rootFolder" />
    <add-clock-modal v-model="obj" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import AddClockModal from '@/components/templates/pbta/DungeonWorld/modals/AddClockModal'
  import ClocksFolder from '@/components/templates/pbta/DungeonWorld/menus/ClocksFolder'

  export default {
    name: 'DwTabClocks',

    components: { ClocksFolder, AddClockModal },

    data() {
      return {
        items: [
          { text: 'создать папку', value: 'folder', callback: () => this.add('folder') },
          { text: 'создать счётчик', value: 'clock', callback: () => this.add('clock') },
        ],
        modalOpen: false,
      }
    },

    computed: {
      ...mapState({
        menus: state => state.game.info.menus,
        master: state => state.game.info.master,
        user: state => state.auth.user,
      }),

      menu: {
        get() {
          return this.menus.find(item => item.type === 'dw-clock')
        },
      },

      obj: {
        get() {
          return { open: this.modalOpen, clock: {} }
        },

        set({ open, clock }) {
          this.addItem(clock)
          this.modalOpen = open
        },
      },
    },

    methods: {
      add(type) {
        const key = Date.now()
        const folderId = this.menu.rootFolder.id
        switch (type) {
          case 'folder':
            this.$store.commit('game/addOpenModal',
              {
                name: 'rename-item-folder',
                parentId: folderId,
                key,
                isNew: true,
                oldName: 'Новая папка',
              })
            return
          case 'clock':
            this.modalOpen = true
            return
        }
      },

      addItem({ title, counter }) {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'add',
          data: {
            folder_id: this.menu.rootFolder.id,
            params: { title, max: counter, current: 0 },
            type: 'menu_item'
          },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    grid-row-gap: 5px;
  }

  .selectButton {
    margin: 0;
    width: auto;
  }
</style>
