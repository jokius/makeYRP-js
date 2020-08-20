<template>
  <right-click-menu :position="position" :current-obj="obj" :acl="clock.acl" :replacedItems="replacedItems">
    <div class="counter-item-grid" @contextmenu="handler($event)">
      <div class="steps">
        <v-stepper>
          <div class="title-grid">
            <input
              v-if="clock.acl.canWrite"
              v-model="title"
              class="counter-title"
            />
            <span v-else class="counter-title">{{ title }}</span>
            <v-btn
              v-if="clock.acl.canFull"
              color="red darken-4"
              dark
              text
              @click="deleteClock"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
          <v-stepper-header>
            <template v-for="step in max">
              <v-stepper-step
                :key="`${step}-step`"
                :complete="current >= step"
                class="step-button"
                :step="step"
                color="black"
                dark
                @click="changeStep(step)"
              />
              <v-divider
                v-if="step !== max"
                :key="step"
              />
            </template>
          </v-stepper-header>
        </v-stepper>
      </div>
    </div>
  </right-click-menu>
</template>

<script>
  import RightClickMenu from '@/components/games/show/RightClickMenu'
  import { mousePosition } from '@/lib/mousePosition'

  export default {
    name: 'CounterItem',

    components: { RightClickMenu },

    props: {
      clock: { type: Object, required: true },
    },

    data: () => ({
      position: {
        x: 0,
        y: 0,
      },
    }),

    computed: {
      title: {
        get() {
          return this.clock.params.title
        },

        set(value) {
          this.$store.commit('game/updateMenuItemParams', {
            id: this.clock.id,
            menuId: this.clock.menuId,
            path: 'title',
            value,
          })

          this.$cable.perform({
            channel: 'GameChannel',
            action: 'change',
            data: { ...this.clock, type: 'menu_item' },
          })
        },
      },

      current: {
        get() {
          return this.clock.params.current
        },

        set(value) {
          this.$store.commit('game/updateMenuItemParams', {
            id: this.clock.id,
            menuId: this.clock.menuId,
            path: 'current',
            value: this.current === value && value === 1 ? 0 : value,
          })

          this.$cable.perform({
            channel: 'GameChannel',
            action: 'change',
            data: { ...this.clock, type: 'menu_item' },
          })
        },
      },

      max: {
        get() {
          return this.clock.params.max
        },
      },

      obj() {
        return {
          type: 'counter',
          id: this.clock.id,
        }
      },

      replacedItems() {
        return [
          { title: 'Доступы', callback: () => this.showAccess(), level: 'canFull' },
          { title: 'Удалить', callback: () => this.deleteNote(), level: 'canFull' },
        ]
      }
    },

    methods: {
      handler(e) {
        this.position = mousePosition(e)
        this.$store.commit('game/updateCurrentRightClickMenu', `counter-${this.clock.id}`)
        e.preventDefault()
      },

      changeStep(step) {
        if (!this.clock.acl.canWrite) return

        this.current = step
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

      deleteClock() {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'remove',
          data: { id: this.clock.id, type: 'menu_item' },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .counter-item-grid {
    display: grid;
    grid-template-columns: 1fr;
  }

  .title-grid {
    display: grid;
    grid-template-columns: 1fr max-content;
    justify-items: center;
    align-items: center;
  }

  .counter-title {
    font-size: 17px;
    font-weight: bold;
    text-align: center;
  }

  .step-button {
    cursor: pointer;
  }
</style>
