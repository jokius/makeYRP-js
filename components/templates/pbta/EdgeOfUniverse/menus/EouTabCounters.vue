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

    <counters-folder :folder="menu.rootFolder" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import CountersFolder from '@/components/templates/pbta/EdgeOfUniverse/menus/CountesFolder'

  export default {
    name: 'EouTabCounters',

    components: { CountersFolder },

    data() {
      return {
        items: [
          { text: 'создать папку', value: 'folder', callback: () => this.add('folder') },
          { text: 'создать счетчик', value: 'clock', callback: () => this.add('clock') },
        ]
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
          return this.menus.find(item => item.type === 'eou-clock')
        },
      },

      obj: {
        get() {
          return { open: this.modalOpen, counter: {} }
        },

        set({ open, counter }) {
          this.addItem(counter)
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
            this.$cable.perform({
              channel: 'GameChannel',
              action: 'add',
              data: {
                folder_id: this.menu.rootFolder.id,
                params: { title: 'Новый счетчик', max: 5, current: 0 },
                type: 'menu_item'
              },
            })
            return
        }
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
