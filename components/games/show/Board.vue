<template>
  <drop class="drop" @drop="handleDrop">
    <right-click-menu :position="position" :current-obj="item" :replaced-items="menuItems">
      <v-stage
        ref="stage"
        class="stage"
        :config="configKonva"
        @contextmenu="showMenu($event)"
        @mousedown="stageMouseDown"
        @mouseup="stageMouseUp"
        @keydown="deletePress"
        @dblclick="dbClickHandle"
      >
        <v-layer ref="graphic">
          <k-image v-if="backgroundUrl" :key="mapKey" :config="backgroundConfig" />
          <template v-for="item in items">
            <k-graphic
              v-if="item.type === 'graphic'"
              :ref="item.name"
              :key="item.name"
              :kind="item.kind"
              :hidden="isHidden(item.layer)"
              :config="item.params"
              :handleEventEnd="handleEventEnd"
              :draggable="canDraggable(item.acl.canWrite)"
            />

            <k-image
              v-else
              :key="item.name"
              :config="item.params"
              :hidden="isHidden(item.layer)"
              :handleEventEnd="handleEventEnd"
              :draggable="canDraggable(item.acl.canWrite)"
            />
          </template>
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
import { mousePosition } from '@/lib/mousePosition'
import RightClickMenu from './RightClickMenu'
import { ImageModel } from '@/models/ImageModel'
import { GraphicModel } from '@/models/GraphicModel'
import { TokenModel } from '@/models/TokenModel'
import KGraphic from './konva/KGraphic'
import { dropImage } from '@/api/folder'
import { layers } from '@/lib/layer'


const DRAWING_POINTS = ['brush', 'rect', 'ellipse', 'text']

export default {
  name: 'Board',
  components: { KGraphic, RightClickMenu, KImage },

  data() {
    return {
      privateItems: [],
      selectedItemName: '',
      position: { x: 0, y: 0 },
      menuItems: [],
      item: {},
      loadingImages: false,
      mapKey: Date.now(),
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
      fontSize: state => state.game.fontSize,
      drawText: state => state.game.drawText,
      currentLayer: state => state.game.currentLayer,
      master: state => state.game.info.master,
      user: state => state.auth.user,
      altPressed: state => state.game.altPressed,
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
        draggable: true,
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

    layers() {
      const list = []
      Object.keys(layers).forEach(layer => {
        if (!layer.hidden || this.isMaster) {
          list.push(layer)
        }
      })
      return list
    },

    items() {
      const items = this.privateItems.filter(item => this.layers.includes(item.layer))
     return items.sort(this.sortByRank)
    },

    itemsByLayer() {
      return this.privateItems.filter(item => item.layer === this.currentLayer).sort(this.sortByRank)
    },

    lastRank() {
      return this.itemsByLayer[this.itemsByLayer.length - 1]?.params?.rank || 0
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
      this.mapKey = Date.now()
    },

    currentLayer() {
      this.resetTransformer()
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

    handleDrop(transferData, nativeEvent) {
      const position = this.mousePosition()

      if (transferData) {
        const { sheet, image } = transferData
        if (sheet) return this.sendToken(sheet, position)
        if (image) return this.sendImage(image, position)
      } else {
        this.dropImages([...nativeEvent.dataTransfer.files], position)
      }
    },

    sendToken(sheet, position) {
      this.add({
        sheet_id: sheet.id,
        layer: this.currentLayer,
        params: {
          url: sheet.imgUrl,
          scaleX: 1,
          scaleY: 1,
          x: position.x,
          y: position.y,
          width: 200,
          height: 150,
          rank: this.lastRank + 1
        },
        type: 'token',
      })
    },

    sendImage(image, position) {
      this.add({
        layer: this.currentLayer,
        params: {
          url: image.imgUrl,
          scaleX: 1,
          scaleY: 1,
          x: position.x,
          y: position.y,
          width: 200,
          height: 150,
          rank: this.lastRank + 1
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

      stage.on('mousedown touchstart', e => {
        if (this.canDraggableStage(e.evt)) return

        pos = this.mousePosition()
        isPaint = DRAWING_POINTS.includes(this.cursor)

        if (this.cursor === 'brush') {
          graphic = new Konva.Line({
            stroke: this.borderColor,
            strokeWidth: this.borderSize,
            points: [pos.x, pos.y],
          })
        } else if (this.cursor === 'rect') {
          graphic = new Konva.Rect({
            stroke: this.borderColor,
            strokeWidth: this.borderSize,
            fill: this.bodyColor,
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
          })
        } else if (this.cursor === 'ellipse') {
          graphic = new Konva.Ellipse({
            stroke: this.borderColor,
            strokeWidth: this.borderSize,
            fill: this.bodyColor,
            x: pos.x,
            y: pos.y,
            radiusX: 0,
            radiusY: 0,
          })
        } else if (this.cursor === 'text') {
          graphic = new Konva.Text({
            text: this.drawText,
            fill: this.borderColor,
            fontSize: this.fontSize,
            x: pos.x,
            y: pos.y,
          })
        }

        if (graphic) layer.add(graphic)
      })

      stage.on('mouseup touchend', e => {
        if (!graphic || this.canDraggableStage(e.evt)) return

        isPaint = false
        const graphicObj = {
          layer: this.currentLayer,
          params: { ...graphic.attrs, rank: this.lastRank + 1 },
          type: 'graphic',
        }

        if (this.cursor === 'brush') {
          this.add({ ...graphicObj, kind: 'line' })
        } else if (this.cursor === 'rect') {
          this.add({ ...graphicObj, kind: 'rect' })
        } else if (this.cursor === 'ellipse') {
          this.add({ ...graphicObj, kind: 'ellipse' })
        } else if (this.cursor === 'text') {
          this.add({ ...graphicObj, kind: 'text' })
        }

        if (graphic) graphic.destroy()
      })

      stage.on('mousemove touchmove', () => {
        if (!isPaint) return
        let newPos = this.mousePosition()

        if (this.cursor === 'brush') {
          const newPoints = graphic.points().concat([newPos.x, newPos.y])
          graphic.points(newPoints)
        } else if (this.cursor === 'rect') {
          graphic.size({ width: newPos.x - pos.x, height: newPos.y - pos.y })
        } else if (this.cursor === 'ellipse') {
          graphic.radius({ x: Math.abs(newPos.x - pos.x), y: Math.abs(newPos.y - pos.y) })
        }

        layer.batchDraw()
      })

      const con = stage.container()
      con.addEventListener('dragover', e => {
        e.preventDefault()
      })

      con.addEventListener('drop', e => {
        e.preventDefault()
        stage.setPointersPositions(e)
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

    stageMouseDown(e) {
      if (e.target === e.target.getStage() || e.target.name() === 'background') {
        this.resetTransformer()
        this.changeStageDraggable(e)
      } else {
        this.showTransformer(e)
      }
    },

    stageMouseUp() {
      const stage = this.$refs.stage.getStage()
      stage.container().style.cursor = 'default'
    },

    changeStageDraggable(e) {
      const event = e.evt
      const stage = this.$refs.stage.getStage()
      const canDraggable = this.canDraggableStage(event)
      stage.draggable(canDraggable)
      stage.container().style.cursor = canDraggable ? 'grabbing' : 'default'
    },

    canDraggableStage(event) {
      return event.button === 2 || this.currentCursor === 'pointer' || (event.button === 0 && event.altKey)
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
        const token = this.privateItems.find(item => item.name === name)
        if (!token.acl.canWrite || this.currentLayer !== token.layer) return

        this.selectedItemName = token.name
      } else if (type === 'image' && this.isMaster) {
        const image = this.privateItems.find(item => item.name === name)
        if (!this.isMaster || this.currentLayer !== image.layer) return

        this.selectedItemName = image.name
      } else if (type === 'graphic') {
        const graphic = this.privateItems.find(item => item.name === name)
        if (!graphic.acl.canWrite || this.currentLayer !== graphic.layer) return

        this.selectedItemName = graphic.name
      } else {
        this.selectedItemName = ''
      }

      this.updateTransformer()
    },

    showMenu(e) {
      e.evt.preventDefault()
      if (DRAWING_POINTS.includes(this.cursor)) return

      this.position = mousePosition(e.evt)
      const name = e.target.name()
      const [type] = name.split('-')
      if (type === 'token') {
        this.tokenRightMenu(this.privateItems.find(item => item.name === name))
      } else if (type === 'image') {
        this.imageRightMenu(this.privateItems.find(item => item.name === name))
      } else if (type === 'graphic') {
        this.graphicRightMenu(this.privateItems.find(item => item.name === name))
      }
    },

    tokenRightMenu(token) {
      if (this.currentLayer !== token.layer) return

      this.menuItems = []
      if (this.isMaster) {
        this.layers.filter(item => item !== token.layer).forEach(layerKey => {
          const layer = layers[layerKey]
          this.menuItems.push({ title: `Перенести на ${layer.name}`,
            callback: () => this.changeLayer({ target: token, type: 'token', layer: layerKey }) })
        })
      }

      this.menuItems.push({ title: 'На передний план',
        callback: () => this.changeRank({ target: token, type: 'token', up: true }) })
      this.menuItems.push({ title: 'На задний план',
        callback: () => this.changeRank({ target: token, type: 'token', down: true }) })
      this.menuItems.push({ title: 'Удалить токен',
        callback: () => this.remove({ id: token.id, type: 'token' }) })
      this.item = { type: 'token', id: token.id }
      this.$store.commit('game/updateCurrentRightClickMenu', `token-${token.id}`)
    },

    imageRightMenu(image) {
      if (this.currentLayer !== image.layer) return

      this.menuItems = []
      if (this.isMaster) {
        this.layers.filter(item => item !== image.layer).forEach(layerKey => {
          const layer = layers[layerKey]
          this.menuItems.push({ title: `Перенести на ${layer.name}`,
            callback: () => this.changeLayer({ target: image, type: 'image', layer: layerKey }) })
        })
      }

      this.menuItems.push({ title: 'На передний план',
        callback: () => this.changeRank({ target: image, type: 'image', up: true }) })
      this.menuItems.push({ title: 'На задний план',
        callback: () => this.changeRank({ target: image, type: 'image', down: true }) })
      this.menuItems.push({ title: 'Удалить изображение',
        callback: () => this.remove({ id: image.id, type: 'image' }) })
      this.item = { id: image.id, type: 'image' }
      this.$store.commit('game/updateCurrentRightClickMenu', `image-${image.id}`)
    },

    graphicRightMenu(graphic) {
      if (this.currentLayer !== graphic.layer) return

      this.menuItems = []
      if (this.isMaster) {
        this.layers.filter(item => item !== graphic.layer).forEach(layerKey => {
          const layer = layers[layerKey]
          this.menuItems.push({ title: `Перенести на ${layer.name}`,
            callback: () => this.changeLayer({ target: graphic, type: 'graphic', layer: layerKey }) })
        })
      }

      this.menuItems.push({ title: 'На передний план',
        callback: () => this.changeRank({ target: graphic, type: 'graphic', up: true }) })
      this.menuItems.push({ title: 'На задний план',
        callback: () => this.changeRank({ target: graphic, type: 'graphic', down: true }) })
      this.menuItems.push({ title: 'Удалить рисунок',
        callback: () => this.remove({ id: graphic.id, type: 'graphic' }) })
      this.item = { id: graphic.id, type: 'graphic' }
      this.$store.commit('game/updateCurrentRightClickMenu', `graphic-${graphic.id}`)
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
      if (obj.echo) this.showEcho(obj)
    },

    findTokenIndex(id) {
      const strId = id.toString()
      return this.privateItems.findIndex(item => item.id === strId && item.type === 'token')
    },

    findImageIndex(id) {
      const strId = id.toString()
      return this.privateItems.findIndex(item => item.id === strId && item.type === 'image')
    },

    findGraphicIndex(id) {
      const strId = id.toString()
      return this.privateItems.findIndex(item => item.id === strId && item.type === 'graphic')
    },

    addToken(raw) {
      const token = new TokenModel().setInfo({
        data: raw.data,
        changeAcl: true,
        currentUserId: this.user.id,
        masterId: this.master.id,
      })
      if (!token.acl.canRead) return
      if (this.findTokenIndex(token.id) >= 0) return

      this.privateItems.push(token)
    },

    addImage(raw) {
      const image = new ImageModel().setInfo({
        data: raw.data,
        changeAcl: true,
        currentUserId: this.user.id,
        masterId: this.master.id,
      })
      if (!image.acl.canRead) return
      if (this.findImageIndex(image.id) >= 0) return

      this.privateItems.push(image)
    },

    addGraphic(raw) {
      const graphic = new GraphicModel().setInfo({
        data: raw.data,
        changeAcl: true,
        currentUserId: this.user.id,
        masterId: this.master.id,
      })
      if (!graphic.acl.canRead) return
      if (this.findGraphicIndex(graphic.id) >= 0) return

      this.privateItems.push(graphic)
    },

    change(params) {
      this.$cable.perform({
        channel: 'PageChannel',
        action: 'change',
        data: { ...params },
      })
    },

    changeObj(obj) {
      if (obj.from === this.user.id) return

      if (obj.token) this.changeToken(obj.token)
      if (obj.image) this.changeImage(obj.image)
      if (obj.graphic) this.changeGraphic(obj.graphic)
    },

    changeToken(raw) {
      const index = this.findTokenIndex(raw.data.id)
      const token = this.privateItems[index]
      token.setInfo({ data: raw.data, changeAcl: false })

      this.$set(this.privateItems, index, token)
      if (this.selectedItemName === token.name) this.resetTransformer()
    },

    changeImage(raw) {
      const index = this.findImageIndex(raw.data.id)
      const image = this.privateItems[index]
      image.setInfo({ data: raw.data, changeAcl: false })

      this.$set(this.privateItems, index, image)
      if (this.selectedItemName === image.name) this.resetTransformer()
    },

    changeGraphic(raw) {
      const index = this.findGraphicIndex(raw.data.id)
      const graphic = this.privateItems[index]
      graphic.setInfo({ data: raw.data, changeAcl: false })

      this.$set(this.privateItems, index, graphic)
      if (this.selectedItemName === graphic.name) this.resetTransformer()
    },

    remove(params) {
      this.$cable.perform({
        channel: 'PageChannel',
        action: 'remove',
        data: { ...params },
      })
    },

    removeObj(obj) {
      if (obj.token) this.removeToken(obj)
      if (obj.image) this.removeImage(obj)
      if (obj.graphic) this.removeGraphic(obj)
    },

    removeToken(token) {
      const index = this.findTokenIndex(token.id)
      this.privateItems.splice(index, 1)
      this.resetTransformer()
    },

    removeImage(image) {
      const index = this.findImageIndex(image.id)
      this.privateItems.splice(index, 1)
      this.resetTransformer()
    },

    removeGraphic(graphic) {
      const index = this.findGraphicIndex(graphic.id)
      this.privateItems.splice(index, 1)
      this.resetTransformer()
    },

    handleEventEnd(e) {
      const target = e.target

      const token = this.privateItems.find(item => item.name === target.name())
      if (token) return this.handleEventObject(token, target, 'token')

      const image = this.privateItems.find(item => item.name === target.name())
      if (image) return this.handleEventObject(image, target, 'image')

      const graphic = this.privateItems.find(graphic => graphic.name === target.name())
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
        layer: object.layer,
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
    },

    canDraggable(can) {
      if (!can) return false

      return this.cursor === 'default' && !this.altPressed
    },

    dropImages(files, position) {
      this.loadingImages = true
      const promises = []

      files.forEach(file => {
        if (file.type.match(/image\//)) {
          promises.push(dropImage({
            axios: this.$axios,
            params: { position, file, pageId: this.pageId },
          }))
        }
      })

      Promise.all(promises).then(() => {
        this.loadingImages = false
      })
    },

    showEcho: async function ({ position, color, from }) {
      const name = `echo-${from}-${Date.now()}`
      const echo = {
        type: 'graphic',
        kind: 'circle',
        acl: { canWrite: false },
        layer: 'players',
        params: {
          name,
          x: position.x,
          y: position.y,
          radius: 8,
          fill: 'transparent',
          stroke: color,
          strokeWidth: 8,
          visible: true,
          rank: 9999999,
        },
      }

      this.privateItems.push(echo)
      await this.$nextTick()

      const layer = this.$refs.graphic.getNode().getLayer()
      const circle = layer.find(node => node.name() === name)[0]

      const tween = new Konva.Tween({
        node: circle,
        radius: 100,
        easing: Konva.Easings.EaseIn,
        duration: 0.85,
        onFinish: () => {
          const index = this.privateItems.findIndex(item => item.name === name)
          this.privateItems.splice(index, 1)
        }
      })

      tween.reset()
      tween.play()
    },

    dbClickHandle(e) {
      if (e.target instanceof Konva.Text) {
        this.editText(e)
      } else {
        this.sendEcho()
      }
    },

    sendEcho() {
      const position = this.mousePosition()
      this.add({ position, type: 'echo' })
    },

    editText(e) {
      const key = Date.now()
      const index = this.privateItems.findIndex(item => item.name === e.target.name())
      const text = this.privateItems[index]
      this.$store.commit('game/addOpenModal',
        {
          name: 'edit-text',
          key,
          text,
          change: this.change,
          callback: (params) => this.$set(this.privateItems, index, { ...text, params })
        })
    },

    isHidden(layer) {
      if (!this.isMaster) return false

      return this.currentLayer === 'gm' && layer !== 'gm' || this.currentLayer !== 'gm' && layer === 'gm'
    },

    updateTarget({ target, type, props }) {
      let index
      switch (type) {
        case 'token':
          index = this.findTokenIndex(target.id)
          this.$set(this.privateItems, index, { ...target, ...props })
          break
        case 'image':
          index = this.findImageIndex(target.id)
          this.$set(this.privateItems, index, { ...target, ...props })
          break
        case 'graphic':
          index = this.findGraphicIndex(target.id)
          this.$set(this.privateItems, index, { ...target, ...props })
          break
      }
    },

    changeLayer({ target, layer, type }) {
      this.updateTarget({ target, type, props: { layer } })
      this.change({
        id: target.id,
        params: { ...target.params },
        layer,
        type,
      })

      this.resetTransformer()
    },

    resetTransformer() {
      this.selectedItemName = ''
      this.updateTransformer()
    },

    sortByRank(item1, item2) {
      const rank1 = layers[item1.layer].weight + item1.params.rank || 0
      const rank2 = layers[item2.layer].weight + item2.params.rank || 0
      return rank1 > rank2 ? 1 : -1
    },

    changeRank({ target, type, up }) {
      let rank
      if (up) {
        rank = this.itemsByLayer[this.itemsByLayer.length - 1].params.rank + 1
      } else {
        rank = this.itemsByLayer[0].params.rank - 1
      }

      this.updateTarget({ target, type, props: { params: { ...target.params, rank } } })
      this.change({
        id: target.id,
        layer: target.layer,
        params: { ...target.params, rank },
        type,
      })
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
