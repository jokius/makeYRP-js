<template>
  <v-dialog :value="obj.open" width="350" persistent>
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
            <span>Добавить Аватарку</span>
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
  import { mapState } from 'vuex'

  export default {
    name: 'EnemyAvatarModal',
    components: { VueDropzone },

    model: {
      prop: 'obj',
      event: 'addAvatar',
    },

    props: {
      obj: { type: Object, required: true },
    },

    computed: {
      ...mapState({
        game: state => state.gameConfig.info,
      }),

      enemy() {
        return this.obj.enemy
      },

      name() {
        return this.enemy.key
      },

      dropzoneOptions() {
        return {
          url: `${process.env.baseUrl}/medias?name=${this.name}&game_id=${this.game.id}`,
          acceptedFiles: 'image/*',
          headers: { Authorization: this.$auth.getToken('local') },
          uploadMultiple: false,
        }
      },
    },

    methods: {
      fileAdded(_file, response) {
        const uri = `/api/medias/${response.key}`
        const versions = { versions: { url: uri, chat: uri, thumb: uri, lazy: uri } }
        this.$set(this.enemy, 'img', versions)

        this.$emit('addAvatar', { open: false, enemy: this.enemy })
      },

      close() {
        this.$emit('addAvatar', { open: false, isClose: true })
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
