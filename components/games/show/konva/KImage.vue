<template>
  <v-image :config="configKonva" @transformend="handleEvent" @dragend="handleEvent" />
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'KImage',

    props: {
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
          return {
            ...this.config,
            image: this.image,
            draggable: this.draggable,
          }
        },
      },
    },

    created() {
      const image = new window.Image()
      image.src = this.config.url
      image.onload = () => this.image = image
    },

    watch: {
      config() {
        const image = new window.Image()
        image.src = this.url
        image.onload = () => this.image = image
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
