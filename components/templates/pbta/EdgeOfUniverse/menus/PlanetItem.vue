<template>
  <right-click-menu :position="position" :current-obj="obj" :acl="planet.acl" :replacedItems="replacedItems">
    <v-list-item class="planet-item-grid" @contextmenu="handler($event)">
      <span>{{ name }}</span>
      <v-btn
        fab
        x-small
        dark
        @click="viewPlanet"
      >
        <v-icon>mdi-eye-outline</v-icon>
      </v-btn>
      <v-btn
        v-if="planet.acl.canWrite"
        fab
        x-small
        dark
        @click="editPlanet"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        v-if="planet.acl.canFull"
        color="red darken-4"
        fab
        x-small
        dark
        @click="deletePlanet"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-list-item>
  </right-click-menu>
</template>

<script>
  import RightClickMenu from '@/components/games/show/RightClickMenu'
  import { mousePosition } from '@/lib/mousePosition'

  export default {
    name: 'PlanetItem',

    components: { RightClickMenu },

    props: {
      planet: { type: Object, required: true },
    },

    data: () => ({
      position: {
        x: 0,
        y: 0,
      },
    }),

    computed: {
      name() {
        return this.planet.params.name
      },

      obj() {
        return {
          type: 'planet',
          id: this.planet.id,
        }
      },

      replacedItems() {
        return [
          { title: 'Изменить', callback: () => this.editPlanet(), level: 'canWrite' },
          { title: 'Просмотреть', callback: () => this.viewPlanet(), level: 'canRead' },
          { title: 'Доступы', callback: () => this.showAccess(), level: 'canFull' },
          { title: 'Удалить', callback: () => this.deletePlanet(), level: 'canFull' },
        ]
      }
    },

    methods: {
      handler(e) {
        this.position = mousePosition(e)
        this.$store.commit('game/updateCurrentRightClickMenu', `planet-${this.planet.id}`)
        e.preventDefault()
      },

      viewPlanet() {
        this.showModal(false)
      },

      editPlanet() {
        this.showModal(true)
      },

      showModal(isEdit) {
        const key = Date.now()
        this.$store.commit('game/addOpenModal',
                           {
                             name: 'planet',
                             key,
                             isNew: false,
                             isEdit: isEdit,
                             planet: this.planet,
                           })
      },

      showAccess() {
        const key = Date.now()
        this.$store.commit('game/addOpenModal',
          {
            name: 'access',
            key,
            obj: { ...this.obj, type: 'menu_item' }
          })
      },

      deletePlanet() {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'remove',
          data: { id: this.planet.id, type: 'menu_item' },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .planet-item-grid {
    display: grid;
    grid-template-columns: 1fr max-content max-content max-content;
    grid-column-gap: 5px;
    justify-items: center;
    align-items: center;
  }
</style>
