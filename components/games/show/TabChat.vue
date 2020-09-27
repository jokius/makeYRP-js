<template>
  <div :class="`base-chat ${isEmptyChat() ? 'empty-chat' : 'chat'}`">
    <div ref="messages" class="messages">
      <chat-message v-for="item in messages" :key="item.id" :message="item" />
    </div>

    <v-text-field
      v-model="text"
      required
      outlined
      placeholder="сообщение..."
      class="field-text"
      type="text"
      @keypress.enter="sendMessage"
      @keydown.up="showOldMessage(1)"
      @keydown.down="showOldMessage(-1)"
    />

    <v-btn
      :dark="text !== ''"
      color="indigo"
      class="bottom-send"
      :disabled="text === ''"
      @click="sendMessage"
    >
      Отправить
    </v-btn>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import ChatMessage from './chat/ChatMessage'
  import { dicesRegx } from '@/lib/dicesRegx'

  const HISTORY_LENGTH = 15

  export default {
    name: 'TabChat',
    components: { ChatMessage },

    data() {
      return {
        text: '',
        count: 0,
        oldMessages: [],
      }
    },

    computed: {
      ...mapState({
        messages: state => state.game.messages,
        users: state => state.game.users,
        currentUser: state => state.auth.user,
      }),
    },

    activated() {
      this.$store.commit('game/resetMarker', 'chat')
      this.$nextTick(function () {
        this.scrollDown()
      })
    },

    mounted() {
      this.$nextTick(function () {
        this.scrollDown()
      })
    },

    updated() {
      this.$nextTick(function () {
        this.scrollDown()
      })
    },

    methods: {
      isEmptyChat() {
        return this.messages.length === 0
      },

      scrollDown() {
        const messages = this.$refs.messages
        messages.scrollTop = messages.scrollHeight
      },

      sendMessage() {
        if (this.text === '') return
        const user = this.users.find(item => item.id === this.currentUser.id)

        const body = {
          sheet: user.sheet.toChat,
          noSystem: true,
        }
        const result = this.text.split(/^\/r\s|^\/roll\s/)

        if (result.length === 2 && result[1].search(dicesRegx) >= 0){
          body.dices_string = result[1]
        } else {
          body.text = this.text
        }

        this.$cable.perform({
          channel: 'GameChannel',
          action: 'add',
          data: {
            body,
            type: 'message'
          },
        })

        this.oldMessages.unshift(this.text)
        this.count = 0

        this.text = ''
      },

      showOldMessage(countAp){
        if ((this.count + countAp) > 0) this.count += countAp
        if (this.count -1 === this.oldMessages.length) this.count = 0
        if (this.oldMessages.length > HISTORY_LENGTH) this.oldMessages.splice( -1, 1)

        if (this.oldMessages[this.count -1] === undefined){
          this.text = ''
        } else {
          this.text = this.oldMessages[this.count-1]
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .base-chat {
    position: relative;
    bottom: 0;
    background-color: #c5c5c5;
  }

  .empty-chat {
    height: calc(100% - 35px * 2);
  }

  .chat {
    top: 70px;
    height: calc(100% - 70px * 2);
  }

  .messages {
    position:absolute;
    height: 100%;
    overflow: auto;
    bottom: 70px;
    width: 100%;
  }

  .field-text {
    position: absolute;
    bottom: 0;
    background-color: $white;
    padding: 5px 5px 0 5px;
    height: 70px;
    width: 100%;
  }

  .bottom-send {
    position: absolute;
    top: 100%;
    left: auto;
    right: 10px;
  }
</style>
