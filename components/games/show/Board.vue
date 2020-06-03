<template>
  <v-stage
      ref="stage"
      class="stage"
      :config="configKonva"
      @contextmenu="handler($event)"
      @mousedown="stageMove"
      @mouseup="stageMove"
  >
    <v-layer ref="map">
      <k-image :url="backgroundUrl" v-if="backgroundUrl" :size="{ width, height }" />
    </v-layer>
  </v-stage>
</template>

<script>
  import { mapState } from 'vuex'
  import KImage from './konva/KImage'

  export default {
    name: 'Board',
    components: { KImage },

    channels: {
      PageChannel: {
        received(obj) {
          if (obj.delete) {
            this.deleteObj(obj)
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
      }),

      params: {
        get() {
          return this.currentPage.params
        },
      },

      width: {
        get() {
          return parseInt(this.params.width, 10)
        },
      },

      height: {
        get() {
          return parseInt(this.params.height, 10)
        },
      },

      xOffset: {
        get() {
          const width = document.getElementsByClassName('body-content')[0].clientWidth
          return (width - this.width) / 2
        },
      },

      yOffset: {
        get() {
          const height = document.getElementsByClassName('body-content')[0].clientHeight
          return (height - this.height) / 2
        },
      },

      configKonva: {
        get() {
          return {
            width: window.innerWidth,
            height: window.innerHeight,
            draggable: true,
          }
        },
      },

      backgroundUrl: {
        get() {
          return this.currentPage.backgroundUrl
        },
      },
    },

    mounted() {
      this.scaleStage()
      this.setPosition()
    },

    watch: {
      params() {
        this.setPosition()
      },
    },

    methods: {
      setPosition() {
        if (this.currentPage.backgroundUrl) {
          const map = this.$refs.map.getNode()
          map.absolutePosition({ x: this.xOffset, y: this.yOffset })
        }
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

          const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy

          stage.scale({ x: newScale, y: newScale })

          const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
          }

          stage.position(newPos)
          stage.batchDraw()
        })
      },

      stageMove(event) {
        const e = event.evt
        const stage = this.$refs.stage.getStage()
        stage.draggable(this.currentCursor === 'pointer' || (e.button === 0 && e.altKey) || e.button === 2)
      },

      handler(e) {
        e.evt.preventDefault()
      },
    },

    // data() {
    //   return {
    //     app: {},
    //     playersContainer: {},
    //     gmContainer: {},
    //     mapContainer: {},
    //     gridContainer: {},
    //     tokens: {},
    //     graphics: {},
    //     position: { x: 0, y: 0 },
    //     menuItems: [],
    //     item: {},
    //     loaded: false,
    //     selectRect: {},
    //     // observer: new EventObserver(),
    //   }
    // },
    //
    //
    // computed: {
    //   ...mapState({
    //     currentPage: state => state.game.currentPage,
    //     sheets: state => state.game.sheets,
    //     currentLayer: state => state.game.currentLayer,
    //     currentCursor: state => state.game.currentCursor,
    //     borderSize: state => state.game.borderSize,
    //     borderColor: state => state.game.borderColor,
    //     bodyColor: state => state.game.bodyColor,
    //   }),
    //
    //   params: {
    //     get() {
    //       return this.currentPage.params
    //     },
    //   },
    //
    //   gridWidth: {
    //     get() {
    //       return parseInt(this.grid.width, 10)
    //     },
    //   },
    //
    //
    //   grid: {
    //     get() {
    //       return this.params.grid
    //     },
    //   },
    //
    //
    //   layer: {
    //     get() {
    //       return `${this.currentLayer}Container`
    //     },
    //   },
    // },
    //
    // // watch: {
    // //   params() {
    // //     this.mapContainer.changeBackground(this.backgroundUrl, this.width, this.height)
    // //     this.gridContainer.drawGrid(this.grid, this.width, this.height)
    // //   },
    // //
    // //   currentCursor() {
    // //     this.containersBroadcast()
    // //   },
    // //
    // //   currentLayer() {
    // //     this.containersBroadcast()
    // //   },
    // //
    // //   borderSize() {
    // //     this.containersBroadcast()
    // //   },
    // //
    // //   borderColor() {
    // //     this.containersBroadcast()
    // //   },
    // //
    // //   bodyColor() {
    // //     this.containersBroadcast()
    // //   },
    // // },
    //
    // mounted() {
    //   const pageId = this.currentPage.id
    //   // this.$cable.subscribe({ channel: 'PageChannel', page_id: pageId })
    //   // this.loadBoard()
    //   // this.loadTokens(pageId)
    //   // this.loadGraphics(pageId)
    // },
    //
    // methods: {
    //   // containersBroadcast() {
    //   //   this.observer.broadcast({
    //   //     layer: this.layer,
    //   //     container: this[this.layer],
    //   //     cursor: this.currentCursor,
    //   //     borderSize: this.borderSize,
    //   //     borderColor: this.borderColor,
    //   //     bodyColor: this.bodyColor,
    //   //   })
    //   // },
    //
    //
    //   checkMove(e) {
    //     return !(e.button === 0 && e.altKey)
    //   },
    //
    //   handler(e) {
    //     this.position = mousePosition(e)
    //     e.preventDefault()
    //   },
    //
    //   addObj(obj) {
    //     if (obj.token) this.tokens.add(obj.token)
    //     if (obj.graphic) this.graphics.add(obj.graphic, this[obj.graphic.layer])
    //   },
    //
    //   changeObj(obj) {
    //     if (obj.token) this.tokens.change(obj.token)
    //     if (obj.graphic) this.graphics.change(obj.graphic, this[obj.graphic.layer])
    //   },
    //
    //   deleteObj(obj) {
    //     if (obj.token) {
    //       const sprite = this.playersContainer.getChildByName(`token_${obj.token.id}`)
    //       this.playersContainer.removeChild(sprite)
    //     }
    //     if (obj.graphic) {
    //       const container = this[obj.graphic.layer]
    //       const sprite = container.getChildByName(`graphic_${obj.graphic.id}`)
    //       container.removeChild(sprite)
    //     }
    //   },
    //
    //   add(params) {
    //     this.$cable.perform({
    //       channel: 'PageChannel',
    //       action: 'add',
    //       data: { ...params },
    //     })
    //   },
    //
    //   move(params) {
    //     this.$cable.perform({
    //       channel: 'PageChannel',
    //       action: 'change',
    //       data: { ...params },
    //     })
    //   },
    //
    //   remove(params) {
    //     this.$cable.perform({
    //       channel: 'PageChannel',
    //       action: 'remove',
    //       data: { ...params },
    //     })
    //   },
    //
    //   loadBoard() {
    //     this.createApp()
    //     this.initContainers()
    //     this.showContainers()
    //   },
    //
    //   tokenRightMenu(id) {
    //     this.menuItems = [{ title: 'Удалить токен', callback: () => this.remove({ id, type: 'token' }) }]
    //     this.item = { type: 'token', id }
    //     this.$store.commit('game/updateCurrentRightClickMenu', `token-${id}`)
    //   },
    //
    //   graphicRightMenu(id) {
    //     this.menuItems = [{ title: 'Удалить рисунок', callback: () => this.remove({ id, type: 'graphic' }) }]
    //     this.item = { type: 'graphic', id }
    //     this.$store.commit('game/updateCurrentRightClickMenu', `graphic-${id}`)
    //   },
    //
    //   createApp() {
    //     this.app = new Application({
    //       width: this.windowWidth,
    //       height: this.windowHeight,
    //       view: this.$refs.renderCanvas,
    //       antialias: true,
    //       transparent: true,
    //       resolution: 1,
    //       interactive: true,
    //     })
    //   },
    //
    //   initContainers() {
    //     this.initContainer('mapContainer')
    //     this.initContainer('gridContainer')
    //     this.initContainer('gmContainer')
    //     this.initContainer('playersContainer')
    //
    //     this.mapContainer.changeBackground(this.backgroundUrl, this.width, this.height)
    //     this.gridContainer.drawGrid(this.grid, this.width, this.height)
    //   },
    //
    //   initContainer(name) {
    //     this[name] = new BoardContainer({
    //       name,
    //       observer: this.observer,
    //       addEvents: name === this.layer,
    //       sendGraphic: this.add,
    //     })
    //   },
    //
    //   showContainers() {
    //     this.app.stage.addChild(this.mapContainer, this.gmContainer, this.playersContainer, this.gridContainer)
    //   },
    //
    //   loadTokens(pageId) {
    //     this.tokens = new Token(this.sheets, this.grid, this.tokenRightMenu, this.playersContainer, this.move)
    //
    //     loadTokens(pageId).then(tokens => {
    //       tokens.forEach(token => this.tokens.add(token))
    //       this.loaded = true
    //     })
    //   },
    //
    //   loadGraphics(pageId) {
    //     this.graphics = new Graphic(this.graphicRightMenu, this.move)
    //
    //     loadGraphics(pageId).then(graphics => {
    //       graphics.forEach(raw => {
    //         const graphic = new GraphicModel().setInfo(raw)
    //         this.graphics.add(graphic, this[graphic.layer])
    //       })
    //       this.loaded = true
    //     })
    //   },
    // },
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
