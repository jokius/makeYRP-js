<template>
  <div class="grid">
    <div :class="[{ selected }, 'button']" @click="cursor = 'brush'">
      <v-icon v-if="cursor === 'rect'" class="icon">mdi-checkbox-blank-outline</v-icon>
      <v-icon v-else-if="cursor === 'ellipse'" class="icon">mdi-checkbox-blank-circle-outline</v-icon>
      <v-icon v-else-if="cursor === 'text'" class="icon">mdi-format-text</v-icon>
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
      <div
        v-if="!['brush', 'text'].includes(cursor)"
        :style="styleBody"
        class="color-current"
        @click="openBodyColorSelect"
      />
      <v-text-field
        v-if="cursor === 'text'"
        v-model="text"
        color="indigo"
        class="input"
        flat
        hide-details
      />
      <v-text-field
        v-if="cursor === 'text'"
        v-model.number="font"
        color="indigo"
        class="input font"
        type="number"
        flat
        hide-details
      />
      <v-select
        v-else
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
        { text: 'От руки', value: 'brush' },
        { text: 'Квадрат', value: 'rect' },
        { text: 'Круг', value: 'ellipse' },
        { text: 'Текст', value: 'text' },
      ],
      sizes: [
        { text: 'Очень тонкие границы 3px', value: 3 },
        { text: 'Тонкие границы 4px', value: 4 },
        { text: 'Обычные границы 5px', value: 5 },
        { text: 'Широкие границы 6px', value: 6 },
        { text: 'Очень широкие границы 7px', value: 7 },
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
      fontSize: state => state.game.fontSize,
      drawText: state => state.game.drawText,
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
      return ['brush', 'rect', 'ellipse', 'text'].includes(this.cursor)
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

    text: {
      get() {
        return this.drawText
      },

      set(value) {
        this.$store.commit('game/changeDrawText', value)
      },
    },

    font: {
      get() {
        return this.fontSize
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
  background-color: #fff;
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

.input {
  margin: 0;
  padding: 0;
}

.font {
  margin-left: 2px;
  width: 60px;
  &:after {
    content: 'px';
    margin-top: 2px;
    color: #000;
  }
}
</style>
