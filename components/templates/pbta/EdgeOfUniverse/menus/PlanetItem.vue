<template>
  <right-click-menu :position="position" :current-obj="obj" :acl="planet.acl" :replacedItems="replacedItems">
    <div class="planet-item-grid hover-color" @contextmenu="handler($event)">
      <v-icon>mdi-map-marker</v-icon>
      <div class="planet-item-title" @click="open">{{ name }}</div>
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="viewPlanet">
            <v-list-item-title>Посмотреть</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="planet.acl.canWrite" @click="editPlanet">
            <v-list-item-title>Изменить</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="planet.acl.canFull" @click="showAccess">
            <v-list-item-title>Доступы</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="planet.acl.canFull" @click="deletePlanet">
            <v-list-item-title>Удалить</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
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
      open() {
        if (this.planet.acl.canWrite) {
          this.editPlanet()
        } else {
          this.viewPlanet()
        }
      },

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
@import '~assets/css/colors';

.planet-item-grid {
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  grid-column-gap: 5px;
  margin-bottom: 10px;
}

.planet-item-title {
  line-height: 32px;
  cursor: pointer;
}

.hover-color {
  &:hover {
    background: $indigoRGBA;
  }
}
</style>
