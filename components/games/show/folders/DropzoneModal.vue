<template>
  <v-dialog :value="openDialog" width="350" persistent>
    <v-card class="dropzone-card">
      <v-card-title class="headline grey lighten-2" primary-title>
        Загрузить изображение
      </v-card-title>
      <v-container class="fill-height" fluid>
        <vue-dropzone
          id="dropzone"
          ref="imageDropzone"
          :options="dropzoneOptions"
          use-custom-slot
          @vdropzone-success="fileAdded"
        >
          <span class="content">
            <v-icon large>mdi-plus</v-icon>
            <span>Добавить изображение</span>
          </span>
        </vue-dropzone>
      </v-container>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn
          dark
          color="indigo"
          @click="close"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import VueDropzone from 'vue2-dropzone'
  import 'vue2-dropzone/dist/vue2Dropzone.min.css'

  export default {
    name: 'DropzoneModal',
    components: { VueDropzone },

    model: {
      prop: 'openDialog',
      event: 'open',
    },

    props: {
      openDialog: { type: Boolean, default: false },
      folderId: { type: Number, required: true },
    },

    computed: {
      dropzoneOptions() {
        return {
          url: `${process.env.baseUrl}/folders/${this.folderId}/images`,
          acceptedFiles: 'image/*',
          headers: { Authorization: this.$auth.getToken('local') }
        }
      },
    },

    methods: {
      close() {
        this.$emit('open', false)
      },

      fileAdded(file, response) {
        this.$store.commit('game/foldersLoaded', response)
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .dropzone-card {
    overflow: hidden;
  }

  .vue-dropzone {
    border: none;
    width: 100%;
  }

  .content {
    display: flex;
    flex-direction: column;
  }
</style>
