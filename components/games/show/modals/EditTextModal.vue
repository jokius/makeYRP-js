<template>
  <draggable-dialog
    :on-close="onClose"
    title="Выбор цвета"
    :width="325"
    :height="470"
    :size="{}"
    name="color-picker"
  >
    <template v-slot:body>
      <v-container class="fill-height modal-body" fluid>
        <v-text-field
          v-model="text"
          required
          color="indigo"
        />
        <v-color-picker
          v-model="fill"
          flat
        />
      </v-container>
    </template>
    <template v-slot:actions>
      <v-btn
        dark
        color="indigo"
        @click="onClose"
      >
        Закрыть
      </v-btn>
      <v-spacer />
      <v-btn
        color="indigo"
        @click="onSave"
      >
        <span class="whiteText">Изменить</span>
      </v-btn>
    </template>
  </draggable-dialog>
</template>

<script>
import { mapState } from 'vuex'
import DraggableDialog from '@/components/games/show/DraggableDialog'

export default {
  name: 'EditTextModal',

  components: { DraggableDialog },

  props: {
    uniqKey: { type: Number, required: true },
    target: { type: Object, required: true },
    change: { type: Function, required: true },
    callback: { type: Function, required: true },
  },

  data() {
    return {
      params: { ...this.target.params },
    }
  },

  computed: {
    ...mapState({
      game: state => state.game.info,
      currentPage: state => state.game.currentPage,
    }),

    text: {
      get() {
        return this.params.text
      },

      set(value) {
        this.params.text = value
      }
    },

    fill: {
      get() {
        return this.params.fill
      },

      set(value) {
        this.params.fill = value
      }
    },
  },

  methods: {
    onClose() {
      this.params = this.target
      this.$store.commit('game/removeOpenModal', this.uniqKey)
    },

    onSave() {
      const params = { ...this.params }
      this.change({
        id: this.target.id,
        params,
        type: 'graphic',
      })

      this.callback(params)
      this.onClose()
    },
  },
}
</script>

<style scoped lang="scss">
@import '~assets/css/colors';

.whiteText {
  color: $white;
}

.modal-body {
  height: 370px;
}
</style>
