<template>
    <v-image :config="config"/>
</template>

<script>
  export default {
    name: 'KImage',

    props: {
      url: { type: String, required: true },
      size: { type: Object, required: true },
    },

    data() {
      return {
        image: null,
      }
    },

    computed: {
      config: {
        get() {
          return {
            image: this.image,
            width: this.size.width,
            height: this.size.height,
          }
        },
      },
    },

    created() {
      const image = new window.Image()
      image.src = this.url
      image.onload = () => this.image = image
    },

    watch: {
      url() {
        const image = new window.Image()
        image.src = this.url
        image.onload = () => this.image = image
      }
    }
  }
</script>
