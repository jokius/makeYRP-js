<template>
  <v-line v-if="kind === 'line'" :config="configKonva" @transformend="handleEvent" @dragend="handleEvent" />
  <v-rect v-else-if="kind === 'rect'" :config="configKonva" @transformend="handleEvent" @dragend="handleEvent" />
  <v-ellipse v-else-if="kind === 'ellipse'" :config="configKonva" @transformend="handleEvent" @dragend="handleEvent" />
  <v-circle v-else-if="kind === 'circle'" :config="configKonva" @transformend="handleEvent" @dragend="handleEvent" />
  <v-text v-else-if="kind === 'text'" :config="configKonva" @transformend="handleEvent" @dragend="handleEvent" />
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'KGraphic',

    props: {
      kind: { type: String, required: true },
      hidden: { type: Boolean, required: true },
      config: { type: Object, required: true },
      draggable: { type: Boolean },
      handleEventEnd: { type: Function },
    },

    data() {
      return {
        image: null,
      }
    },

    computed: {
      ...mapState({
        currentCursor: state => state.game.currentCursor,
      }),

      configKonva: {
        get() {
          const opacity = this.hidden ? 0.5 : 1
          return { ...this.config, draggable: this.draggable, opacity }
        },
      },
    },

    methods: {
      handleEvent(e){
        if (!this.handleEventEnd) return

        this.handleEventEnd(e)
      }
    }
  }
</script>
