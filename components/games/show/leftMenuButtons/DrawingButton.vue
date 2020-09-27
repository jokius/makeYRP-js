<template>
  <div class="grid">
    <div :class="[{ selected }, 'button']" @click="cursor = 'brush'">
      <v-icon v-if="cursor === 'rect'" class="icon">mdi-checkbox-blank-outline</v-icon>
      <v-icon v-else-if="cursor === 'ellipse'" class="icon">mdi-checkbox-blank-circle-outline</v-icon>
      <v-icon v-else class="icon">mdi-brush</v-icon>
    </div>

    <div v-if="selected" class="drawing-item">
      <v-select
        v-model="kind"
        :items="kinds"
        color="indigo"
        item-color="indigo"
        class="select kind"
        flat
      />
      <div :style="styleBorder" class="color-current" @click="openBorderColorSelect" />
      <div v-if="cursor !== 'brush'" :style="styleBody" class="color-current" @click="openBodyColorSelect" />
      <v-select
        v-model="size"
        :items="sizes"
        color="indigo"
        item-color="indigo"
        class="select"
        flat
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DrawingButton',

  data() {
    return {
      kinds: [
        { text: 'Отруки', value: 'brush' },
        { text: 'Квадрат', value: 'rect' },
        { text: 'Круг', value: 'ellipse' },
      ],
      sizes: [
        { text: 'Очень тонкие граници 3px', value: 3 },
        { text: 'Тонкие граници 4px', value: 4 },
        { text: 'Обычные граници 5px', value: 5 },
        { text: 'Широкие граници 6px', value: 6 },
        { text: 'Очень широкие граници 7px', value: 7 },
      ],
      targetBorder: { type: 'borderColor' },
      targetBody: { type: 'bodyColor' },
    }
  },

  computed: {
    ...mapState({
      user: state => state.auth.user,
      currentCursor: state => state.game.currentCursor,
      borderSize: state => state.game.borderSize,
      borderColor: state => state.game.borderColor,
      bodyColor: state => state.game.bodyColor,
    }),

    cursor: {
      get() {
        return this.currentCursor
      },

      set(value) {
        this.$store.commit('game/changeCurrentCursor', value)
      },
    },

    selected() {
      return ['brush', 'rect', 'ellipse'].includes(this.cursor)
    },

    kind: {
      get() {
        return this.currentCursor
      },

      set(value) {
        this.$store.commit('game/changeCurrentCursor', value)
      },
    },

    size: {
      get() {
        return this.borderSize
      },

      set(value) {
        this.$store.commit('game/changeBorderSize', value)
      },
    },

    styleBorder() {
      return {
        backgroundColor: this.borderColor,
      }
    },

    styleBody() {
      return {
        backgroundImage: this.bodyColor !== '#00000000' ? 'none' : 'url("/images/transparent.png")',
        backgroundColor: this.bodyColor,
      }
    },
  },

  // created() {
  //   console.log('this.user.color', this.user.color)
  //   if (this.borderColor) this.$store.commit('game/changeBorderColor', this.user.color)
  //   console.log('this.borderColor', this.borderColor)
  // },

  methods: {
    openBorderColorSelect() {
      const key = Date.now()
      this.$store.commit('game/addOpenModal', {
        key,
        name: 'color-picker',
        target: this.targetBorder,
        startColor: this.borderColor,
      })
    },

    openBodyColorSelect() {
      const key = Date.now()
      this.$store.commit('game/addOpenModal', {
        key,
        name: 'color-picker',
        target: this.targetBody,
        startColor: this.bodyColor,
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import '~assets/css/colors';

$border: 1px solid $black;

.button {
  width: 30px;
  height: 30px;
  background-color: $white;
  border: $border;
  border-bottom: none;
  cursor: pointer;
}

.icon {
  padding-left: 2px;
  padding-top: 2px;
}

.selected {
  background-color: $indigoRGBA;
}

.drawing-item {
  display: inline-flex;
  position: absolute;
  z-index: 3;
  top: 0;
  left: 35px;
  border: $border;
  background-color: $white;
  width: max-content;
  padding: 5px;
}

.color-current {
  cursor: pointer;
  width: 33px;
  height: 33px;
  border: 1px solid $black;
  margin-right: 5px;
}

.select {
  margin: 0;
  padding: 0;
  width: 271px;
  height: 33px;
}

.kind {
  width: 130px;
  margin-right: 5px;
}
</style>
