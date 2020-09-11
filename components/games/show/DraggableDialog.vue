<template>
  <vue-draggable-resizable
    drag-handle=".drag-handle"
    :w="isShow ? width : 'auto'"
    :h="isShow ? height : 40"
    :x="xPoint"
    :y="yPoint"
    :z="zIndex"
    :min-width="150"
    :min-height="40"
    :resizable="resizable && isShow"
    :active="resizable && isShow"
    class-name-active="resize-boards"
    class-name-handle="draggable-dialog-handle"
    @resizing="onResize"
    :class="{ opacity: !isShow }"
  >
    <div @click.capture="changeZIndex">
      <v-card v-if="isShow" class="resize-style" :style="style" ref="dragWidow">
        <v-toolbar
          height="40"
          dark color="indigo"
          class="draggable-dialog-header drag-handle"
          @dblclick="isShow = false"
        >
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="isShow = false">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <v-btn icon dark @click="onClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <slot name="body" />
        <v-divider v-if="hasActionsSlot" />
        <v-card-actions v-if="hasActionsSlot">
          <slot name="actions" />
        </v-card-actions>
      </v-card>
      <v-card v-else class="resize-style" ref="dragWidow">
        <v-toolbar
          height="40"
          dark color="indigo"
          class="draggable-dialog-header drag-handle"
          @dblclick="isShow = true"
        >
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-btn icon dark @click="isShow = true">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          <v-btn icon dark @click="onClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
    </div>
  </vue-draggable-resizable>
</template>

<script>
  import { mapState } from 'vuex'
  import VueDraggableResizable from 'vue-draggable-resizable'
  import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

  const START_INDEX = 100

  export default {
    name: 'DraggableDialog',
    components: { VueDraggableResizable },

    model: {
      prop: 'size',
      event: 'onResize',
    },

    props: {
      title: { type: String, required: true },
      onClose: { type: Function, required: true },
      width: { type: [Number, String], default: 200 },
      height: { type: [Number, String], default: 200 },
      resizable: { type: Boolean, default: false },
      disableActions: { type: Boolean, default: false },
      backgroundColor: { type: String },
    },

    data() {
      return {
        id: Date.now(),
        xPoint: 0,
        yPoint: 0,
        dataWidth: null,
        dataHeight: null,
        isShow: true,
        zIndex: START_INDEX,
      }
    },

    computed: {
      ...mapState({
        openModals: state => state.game.openModals,
        modalsZIndex: state => state.game.modalsZIndex,
      }),

      hasActionsSlot: {
        get() {
          return !!this.$slots.actions && !this.disableActions
        },
      },

      style: {
        get() {
          const width = this.dataWidth || this.width
          const height = this.dataHeight || this.height
          const style = { width: `${width}px`, height: `${height}px` }
          if (this.backgroundColor) style.backgroundColor = this.backgroundColor

          return style
        },
      },
    },

    created() {
      window.addEventListener('resize', this.handleResize)
      this.handleResize()
      this.zIndex = this.maxZIndex() + 1
      this.$store.commit('game/addZIndex', { id: this.id, zIndex: this.zIndex })
    },

    mounted() {
      const el = this.$refs.dragWidow.$el
      const width = el.clientWidth
      const height = el.clientHeight
      const modals = this.openModals.length
      this.xPoint = (window.innerWidth - width) / 2 + (modals - 1) * 40
      this.yPoint = (window.innerHeight - height) / 2 + (modals - 1)  * 40
    },

    destroyed() {
      window.removeEventListener('resize', this.handleResize)
      this.$store.commit('game/removeZIndex', this.id)
    },

    methods: {
      maxZIndex() {
        const max = this.modalsZIndex[0] || {}
        return max.zIndex || START_INDEX
      },

      changeZIndex() {
        const max = this.maxZIndex()
        if (this.zIndex < max) {
          this.zIndex = max + 1
          this.$store.commit('game/changeZIndex', { id: this.id, zIndex: this.zIndex })
        }
      },

      handleResize() {
        if (!this.resizable) return

        this.xPoint = (window.innerWidth - this.width) / 2
        this.yPoint = (window.innerHeight - this.height) / 2
      },

      onResize: function (_x, _y, width, height) {
        if (!this.resizable) return

        this.$emit('onResize', { width, height })
      },
    },
  }
</script>

<style lang="scss">
.opacity {
  opacity: 0.75;
}

.draggable-dialog-header {
  cursor: move;
}

.draggable-dialog-handle {
  position: absolute;
  background-color: black;
  height: 2px;
  width: 2px;
}

.draggable-dialog-handle-tl {
  display: block;
  cursor: nw-resize;
  top: -2px;
  left: -1px;
  width: 4px;
  height: 3px;
}

.draggable-dialog-handle-tm {
  display: block;
  cursor: n-resize;
  top: -2px;
  width: 100%;
}

.draggable-dialog-handle-tr {
  display: block;
  cursor: ne-resize;
  top: -2px;
  right: -1px;
  width: 4px;
  height: 3px;
}

.draggable-dialog-handle-mr {
  display: block;
  cursor: e-resize;
  height: 100%;
  right: -2px;
}

.draggable-dialog-handle-bl {
  display: block;
  cursor: sw-resize;
  bottom: -2px;
  left: -1px;
  width: 4px;
  height: 3px;
}

.draggable-dialog-handle-bm {
  display: block;
  cursor: s-resize;
  bottom: -4px;
  width: 100%;
}

.draggable-dialog-handle-ml {
  display: block;
  cursor: w-resize;
  height: 100%;
  left: -2px;
}

.draggable-dialog-handle-br {
  display: block;
  cursor: se-resize;
  bottom: -2px;
  right: -1px;
  width: 4px;
  height: 3px;
}
</style>
