<template>
  <div>
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

      <planets-folder :folder="menu.rootFolder" />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { MenuItemModel } from '@/models/MenuItemModel'
  import PlanetsFolder from '@/components/templates/pbta/EdgeOfUniverse/menus/PlanetsFolder'

  export default {
    name: 'EouTabPlanets',

    components: { PlanetsFolder },

    data() {
      return {
        items: [
          { text: 'создать папку', value: 'folder', callback: () => this.add('folder') },
          { text: 'создать планету', value: 'planet', callback: () => this.add('planet') },
        ]
      }
    },

    computed: {
      ...mapState({
        menus: state => state.game.info.menus,
        user: state => state.auth.user,
        master: state => state.game.info.master,
      }),

      menu: {
        get() {
          return this.menus.find(item => item.type === 'eou-planet')
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
          case 'planet':
            const planet = new MenuItemModel()
            planet.menuId = this.menu.id
            planet.folderId = folderId
            this.$store.commit('game/addOpenModal', {
              name: 'planet',
              key,
              isNew: true,
              isEdit: true,
              planet,
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
