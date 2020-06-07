<template>
  <v-image :config="configKonva" @transformend="handleEvent" @dragend="handleEvent" />
</template>

<script>
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
      configKonva: {
        get() {
          return { ...this.config, draggable: this.draggable, image: this.image }
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
