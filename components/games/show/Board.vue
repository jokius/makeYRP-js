<template>
  <drop class="drop" @drop="handleDrop">
    <right-click-menu :position="position" :current-obj="item" :replaced-items="menuItems">
      <v-stage
        ref="stage"
        class="stage"
        :config="configKonva"
        @contextmenu="showMenu($event)"
        @mousedown="stageClick"
        @keydown="deletePress"
      >
        <v-layer ref="map">
          <k-image v-if="backgroundUrl" :config="backgroundConfig" />
        </v-layer>
        <v-layer ref="graphic">
          <k-graphic
            v-for="graphic in graphics"
            :key="graphic.params.name"
            :kind="graphic.kind"
            :config="graphic.params"
            :handleEventEnd="handleEventEnd"
            draggable
          />

          <k-image
            v-for="token in tokens"
            :key="token.name"
            :config="token.params"
            :handleEventEnd="handleEventEnd"
            :draggable="token.acl.canWrite"
          />
          <k-image
            v-for="image in images"
            :key="image.params.name"
            :config="image.params"
            :handleEventEnd="handleEventEnd"
            :draggable="isMaster"
          />
          <v-transformer ref="transformer" />
        </v-layer>
      </v-stage>
    </right-click-menu>
  </drop>
</template>

<script>
  import { mapState } from 'vuex'
  import KImage from './konva/KImage'
  import { loadGraphics, loadImages, loadTokens } from '@/api/board'
  import { TokenModel } from '@/models/TokenModel'
  import { mousePosition } from '@/lib/mousePosition'
  import RightClickMenu from './RightClickMenu'
  import { ImageModel } from '@/models/ImageModel'
  import { GraphicModel } from '@/models/GraphicModel'
  import KGraphic from './konva/KGraphic'

  export default {
    name: 'Board',
    components: { KGraphic, RightClickMenu, KImage },

    data() {
      return {
        tokens: [],
        images: [],
        graphics: [],
        selectedItemName: '',
        position: { x: 0, y: 0 },
        menuItems: [],
        item: {},
      }
    },

    channels: {
      PageChannel: {
        received(obj) {
          if (obj.delete) {
            this.removeObj(obj)
          } else if (obj.update) {
            this.changeObj(obj)
          } else {
            this.addObj(obj)
          }
        },
      },
    },

    computed: {
      ...mapState({
        currentPage: state => state.game.currentPage,
        currentCursor: state => state.game.currentCursor,
        borderSize: state => state.game.borderSize,
        borderColor: state => state.game.borderColor,
        bodyColor: state => state.game.bodyColor,
        master: state => state.game.info.master,
        user: state => state.auth.user,
      }),

      cursor() {
        return this.currentCursor
      },

      params() {
        return this.currentPage.params
      },

      pageId() {
        return this.currentPage.id
      },

      width() {
        return parseInt(this.params.width, 10)
      },

      height() {
        return parseInt(this.params.height, 10)
      },

      xOffset() {
        const width = window.screen.width
        return (width - this.width) / 2
      },

      yOffset() {
        const height = window.screen.height
        return (height - this.height) / 2
      },

      configKonva() {
        return {
          width: this.width,
          height: this.height,
          draggable: false,
        }
      },

      backgroundUrl() {
        return this.currentPage.backgroundUrl
      },

      backgroundConfig() {
        return {
          name: 'background',
          url: this.backgroundUrl,
          width: this.width,
          height: this.height,
          x: 0,
          y: 0,
        }
      },

      isMaster() {
        return this.user.id === this.master.id
      },
    },

    created() {
      this.loadTokens()
      this.loadImages()
      this.loadGraphics()
    },

    mounted() {
      this.$cable.subscribe({ channel: 'PageChannel', page_id: this.pageId })
      this.scaleStage()
      this.setPosition()
      this.setDrawing()
      const stage = this.$refs.stage
      stage.$el.tabIndex = 1
      stage.$el.focus()
      stage.$el.addEventListener('keydown', this.deletePress)
    },

    watch: {
      params() {
        this.setPosition()
      },
    },

    methods: {
      mousePosition() {
        const stage = this.$refs.stage.getStage()
        const transform = stage.getAbsoluteTransform().copy()
        transform.invert()
        const pos = stage.getPointerPosition()
        return transform.point(pos)
      },

      handleDrop({ sheet, image }) {
        const position = this.mousePosition()
        if (sheet) return this.sendToken(sheet, position)
        if (image) return this.sendImage(image, position)
      },

      sendToken(sheet, position) {
        this.add({
          sheet_id: sheet.id,
          params: {
            url: sheet.imgUrl,
            scaleX: 1,
            scaleY: 1,
            x: position.x,
            y: position.y,
            width: 200,
            height: 150,
          },
          type: 'token',
        })
      },

      sendImage(image, position) {
        this.add({
          params: {
            url: image.imgUrl,
            scaleX: 1,
            scaleY: 1,
            x: position.x,
            y: position.y,
            width: 200,
            height: 150,
          },
          type: 'image',
        })
      },

      setPosition() {
        const stage = this.$refs.stage.getStage()
        stage.setPosition({ x: this.xOffset, y: this.yOffset })
      },

      setDrawing() {
        let graphic = null
        let isPaint = false
        const stage = this.$refs.stage.getStage()
        const layer = this.$refs.graphic.getNode()
        let pos = {}

        stage.on('mousedown touchstart', () => {
          pos = this.mousePosition()
          isPaint = ['brush', 'rect', 'circle'].includes(this.cursor)

          if (this.cursor === 'brush') {
            graphic = new Konva.Line({
              stroke: this.borderColor,
              strokeWidth: this.borderSize,
              points: [pos.x, pos.y],
            })

            layer.add(graphic)
          } else if (this.cursor === 'rect') {
            graphic = new Konva.Rect({
              stroke: this.borderColor,
              strokeWidth: this.borderSize,
              fill: this.bodyColor,
              x: pos.x,
              y: pos.y,
              width: 0,
              height: 0
            })

            layer.add(graphic)
          } else if (this.cursor === 'circle') {
            graphic = new Konva.Ellipse({
              stroke: this.borderColor,
              strokeWidth: this.borderSize,
              fill: this.bodyColor,
              x: pos.x,
              y: pos.y,
              radiusX: 0,
              radiusY: 0
            })

            layer.add(graphic)
          }
        })

        stage.on('mouseup touchend', () => {
          isPaint = false
          if (this.cursor === 'brush') {
            this.add({
              params: graphic.attrs,
              kind: 'line',
              type: 'graphic',
            })
            graphic.destroy()
          } else if (this.cursor === 'rect') {
            this.add({
              params: graphic.attrs,
              kind: 'rect',
              type: 'graphic',
            })
            graphic.destroy()
          } else if (this.cursor === 'circle') {
            this.add({
              params: graphic.attrs,
              kind: 'circle',
              type: 'graphic',
            })
            graphic.destroy()
          }
        })

        stage.on('mousemove touchmove', () => {
          if (!isPaint) return
          let newPos = this.mousePosition()

          if (this.cursor === 'brush') {
            const newPoints = graphic.points().concat([newPos.x, newPos.y])
            graphic.points(newPoints)
          }  else if (this.cursor === 'rect') {
            graphic.size({ width: newPos.x - pos.x, height: newPos.y - pos.y })
          }  else if (this.cursor === 'circle') {
            graphic.radius({ x: Math.abs(newPos.x - pos.x), y: Math.abs(newPos.y - pos.y) })
          }

          layer.batchDraw()
        })
      },

      scaleStage() {
        const stage = this.$refs.stage.getStage()

        const scaleBy = 1.10
        stage.on('wheel', (e) => {
          e.evt.preventDefault()
          const oldScale = stage.scaleX()

          const pointer = stage.getPointerPosition()

          const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
          }

          const newScale = e.evt.deltaY <= 0 ? oldScale * scaleBy : oldScale / scaleBy

          stage.scale({ x: newScale, y: newScale })

          const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
          }

          stage.position(newPos)
          stage.batchDraw()
        })
      },

      stageClick(e) {
        if (e.target === e.target.getStage() || e.target.name() === 'background') {
          this.selectedItemName = ''
          this.updateTransformer()
          this.changeStageDraggable(e)
        } else {
          this.showTransformer(e)
        }
      },

      changeStageDraggable(e) {
        const event = e.evt
        const stage = this.$refs.stage.getStage()
        stage.draggable(this.currentCursor === 'pointer' || (event.button === 0 && event.altKey))
      },

      showTransformer(e) {
        if (this.cursor !== 'default') {
          this.selectedItemName = ''
          return
        }

        const clickedOnTransformer = e.target.getParent().className === 'Transformer'
        if (clickedOnTransformer) return

        const name = e.target.name()
        const [type] = name.split('-')
        if (type === 'token') {
          const token = this.tokens.find(item => item.name === name)
          if (!token.acl.canWrite) return

          this.selectedItemName = token.name
        } else if (type === 'image' && this.isMaster) {
          const image = this.images.find(item => item.params.name === name)
          if (!this.isMaster) return

          this.selectedItemName = image.params.name
        } else if (type === 'graphic') {
          this.selectedItemName = this.graphics.find(item => item.params.name === name).params.name
        } else {
          this.selectedItemName = ''
        }

        this.updateTransformer()
      },

      showMenu(e) {
        e.evt.preventDefault()
        this.position = mousePosition(e.evt)
        const name = e.target.name()
        const [type] = name.split('-')
        if (type === 'token') {
          this.tokenRightMenu(this.tokens.find(item => item.name === name).id)
        } else if (type === 'image') {
          this.imageRightMenu(this.images.find(item => item.params.name === name).id)
        }
      },

      tokenRightMenu(id) {
        this.menuItems = [{ title: 'Удалить токен', callback: () => this.remove({ id, type: 'token' }) }]
        this.item = { type: 'token', id }
        this.$store.commit('game/updateCurrentRightClickMenu', `token-${id}`)
      },

      imageRightMenu(id) {
        this.menuItems = [{ title: 'Удалить изображение', callback: () => this.remove({ id, type: 'image' }) }]
        this.item = { type: 'image', id }
        this.$store.commit('game/updateCurrentRightClickMenu', `image-${id}`)
      },

      loadTokens() {
        loadTokens({ axios: this.$axios, page_id: this.pageId }).then(({ data }) => {
          data.forEach(raw => this.addToken({ data: raw }))
        })
      },

      loadImages() {
        loadImages({ axios: this.$axios, page_id: this.pageId }).then(({ data }) => {
          data.forEach(raw => this.addImage({ data: raw }))
        })
      },

      loadGraphics() {
        loadGraphics({ axios: this.$axios, page_id: this.pageId }).then(({ data }) => {
          data.forEach(raw => this.addGraphic({ data: raw }))
        })
      },

      add(params) {
        this.$cable.perform({
          channel: 'PageChannel',
          action: 'add',
          data: { ...params },
        })
      },

      addObj(obj) {
        if (obj.token) this.addToken(obj.token)
        if (obj.image) this.addImage(obj.image)
        if (obj.graphic) this.addGraphic(obj.graphic)
      },

      addToken(raw) {
        const token = new TokenModel().setInfo({
          data: raw.data,
          changeAcl: true,
          currentUserId: this.user.id,
          masterId: this.master.id,
        })
        if (!token.acl.canRead) return

        this.tokens = [...this.tokens, token]
      },

      addImage(raw) {
        const image = new ImageModel().setInfo({
          data: raw.data,
          changeAcl: true,
          currentUserId: this.user.id,
          masterId: this.master.id,
        })
        if (!image.acl.canRead) return

        this.images = [...this.images, image]
      },

      addGraphic(raw) {
        console.log('raw', raw)
        const graphic = new GraphicModel().setInfo({
          data: raw.data,
          changeAcl: true,
          currentUserId: this.user.id,
          masterId: this.master.id,
        })
        if (!graphic.acl.canRead) return

        this.graphics = [...this.graphics, graphic]
      },

      change(params) {
        this.$cable.perform({
          channel: 'PageChannel',
          action: 'change',
          data: { ...params },
        })
      },

      changeObj(obj) {
        if (obj.token) this.changeToken(obj.token, obj.by)
        if (obj.image) this.changeImage(obj.image)
        if (obj.graphic) this.changeGraphic(obj.graphic)
      },

      changeToken(raw, by) {
        const index = this.tokens.findIndex(item => item.id === raw.data.id)
        const token = this.tokens[index]
        token.setInfo({
          data: raw.data,
          changeAcl: false,
        })
        this.$set(this.tokens, index, token)
        if (this.user.id !== by && this.selectedItemName === token.name) {
          this.selectedItemName = ''
          this.updateTransformer()
        }
      },

      changeImage(raw) {
        const index = this.images.findIndex(item => item.id === raw.id)
        const image = this.images[index]
        image.setInfo({
          data: raw.data,
          changeAcl: false,
        })
        this.$set(this.images, index, image)
      },

      changeGraphic(raw) {
        const index = this.graphics.findIndex(item => item.id === raw.id)
        const graphic = this.graphics[index]
        graphic.setInfo({
          data: raw.data,
          changeAcl: false,
        })
        this.$set(this.graphics, index, graphic)
      },

      remove(params) {
        this.$cable.perform({
          channel: 'PageChannel',
          action: 'remove',
          data: { ...params },
        })
      },

      removeObj(obj) {
        if (obj.token) this.removeToken(obj.token)
        if (obj.image) this.removeImage(obj.image)
        if (obj.graphic) this.removeGraphic(obj.graphic)
      },

      removeToken(token) {
        const index = this.tokens.findIndex(item => item.id === token.id.toString())
        this.tokens.splice(index, 1)
        this.selectedItemName = ''
        this.updateTransformer()
      },

      removeImage(image) {
        const index = this.images.findIndex(item => item.id === image.id.toString())
        this.images.splice(index, 1)
        this.selectedItemName = ''
        this.updateTransformer()
      },

      removeGraphic(graphic) {
        const index = this.graphics.findIndex(item => item.id === graphic.id.toString())
        this.graphics.splice(index, 1)
        this.selectedItemName = ''
        this.updateTransformer()
      },

      handleEventEnd(e) {
        const target = e.target
        const token = this.tokens.find(token => token.name === target.name())
        if (token) return this.handleEventObject(token, target, 'token')

        const image = this.images.find(image => image.params.name === target.name())
        if (image) return this.handleEventObject(image, target, 'image')

        const graphic = this.graphics.find(graphic => graphic.params.name === target.name())
        if (graphic) this.handleEventObject(graphic, target, 'graphic')
      },

      handleEventObject(object, target, type) {
        object.params.x = target.x()
        object.params.y = target.y()
        object.params.rotation = target.rotation()
        object.params.scaleX = target.scaleX()
        object.params.scaleY = target.scaleY()
        this.change({
          id: object.id,
          params: { ...object.params },
          type,
        })
      },

      updateTransformer() {
        const transformerNode = this.$refs.transformer.getNode()
        const stage = transformerNode.getStage()

        const selectedNode = stage.findOne(`.${this.selectedItemName}`)
        if (selectedNode === transformerNode.node()) return

        if (selectedNode) {
          transformerNode.attachTo(selectedNode)
        } else {
          transformerNode.detach()
        }

        transformerNode.getLayer().batchDraw()
      },

      deletePress(e) {
        if (e.code !== 'Delete' && e.code !== 'Backspace') return
        if (this.selectedItemName === '') return

        const [type, id] = this.selectedItemName.split('-')
        this.remove({ id, type })
      }
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .stage {
    position: absolute;
  }

  .loaded {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    background: $white;
  }
</style>
