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
          <v-transformer ref="transformer" />
        </v-layer>
        <v-layer ref="images">
          <k-image
            v-for="(token, index) in tokens"
            :key="`tokens-${token.id}-${index}`"
            :config="token.params"
            :handleEventEnd="handleEventEnd"
            :draggable="token.acl.canWrite"
          />
        </v-layer>
      </v-stage>
    </right-click-menu>
  </drop>
</template>

<script>
  import { mapState } from 'vuex'
  import KImage from './konva/KImage'
  import { loadTokens } from '../../../api/board'
  import { TokenModel } from '../../../models/TokenModel'
  import { mousePosition } from '../../../lib/mousePosition'
  import RightClickMenu from './RightClickMenu'

  export default {
    name: 'Board',
    components: { RightClickMenu, KImage },

    data() {
      return {
        tokens: [],
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
        master: state => state.game.info.master,
        user: state => state.auth.user,
      }),

      params: {
        get() {
          return this.currentPage.params
        },
      },

      pageId: {
        get() {
          return this.currentPage.id
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
            draggable: false,
          }
        },
      },

      backgroundUrl: {
        get() {
          return this.currentPage.backgroundUrl
        },
      },

      backgroundConfig: {
        get() {
          return {
            name: 'background',
            url: this.backgroundUrl,
            width: this.width,
            height: this.height,
            x: 0,
            y: 0,
          }
        },
      },
    },

    created() {
      this.loadTokens()
    },

    mounted() {
      this.$cable.subscribe({ channel: 'PageChannel', page_id: this.pageId })
      this.scaleStage()
      this.setPosition()
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
      handleDrop({ sheet }, e) {
        const position = mousePosition(e)
        this.add({
          sheet_id: sheet.id,
          params: {
            url: sheet.imgUrl,
            scaleX: 1,
            scaleY: 1,
            x: position.x,
            y: position.y,
          },
          type: 'token',
        })
      },

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
        const clickedOnTransformer = e.target.getParent().className === 'Transformer'
        if (clickedOnTransformer) return

        const name = e.target.name()
        const token = this.tokens.find(token => token.params.name === name)
        if (token && token.acl.canWrite) {
          this.selectedItemName = token.params.name
        } else {
          this.selectedItemName = ''
        }

        this.updateTransformer()
      },

      showMenu(e) {
        e.evt.preventDefault()
        const target = e.target
        const token = this.tokens.find(token => token.params.name === target.name())

        if (token && token.acl.canWrite) {
          this.position = mousePosition(e.evt)
          this.tokenRightMenu(token.id)
        }
      },

      tokenRightMenu(id) {
        this.menuItems = [{ title: 'Удалить токен', callback: () => this.remove({ id, type: 'token' }) }]
        this.item = { type: 'token', id }
        this.$store.commit('game/updateCurrentRightClickMenu', `token-${id}`)
      },

      loadTokens() {
        loadTokens({ axios: this.$axios, page_id: this.pageId }).then(tokens => {
          tokens.forEach(raw => this.addToken(raw))
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
      },

      addToken(raw) {
        const token = new TokenModel().setInfo(raw)
        token.acl.currentUserId = this.user.id
        token.acl.masterId = this.master.id
        if (!token.acl.canRead) return

        this.tokens = [...this.tokens, token]
      },

      change(params) {
        this.$cable.perform({
          channel: 'PageChannel',
          action: 'change',
          data: { ...params },
        })
      },

      changeObj(obj) {
        if (obj.token) this.changeToken(obj.token)
      },

      changeToken(raw) {
        const index = this.tokens.findIndex(item => item.id === raw.id)
        const token = this.tokens[index]
        token.setInfo(raw)
        token.acl.currentUserId = this.user.id
        token.acl.masterId = this.master.id
        this.$set(this.tokens, index, token)
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
      },

      removeToken(token) {
        const index = this.tokens.findIndex(item => item.id === token.id)
        this.tokens.splice(index, 1)
        this.selectedItemName = ''
        this.updateTransformer()
      },

      handleEventEnd(e) {
        const target = e.target
        const token = this.tokens.find(token => token.params.name === target.name())
        token.params.x = target.x()
        token.params.y = target.y()
        token.params.rotation = target.rotation()
        token.params.scaleX = target.scaleX()
        token.params.scaleY = target.scaleY()
        this.change({
          id: token.id,
          params: { ...token.params },
          type: 'token',
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
