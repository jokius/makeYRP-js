<template>
  <div class="left-menu-actions">
    <cursor-button />
    <drawing-button />
    <layer-button v-if="user.id === master.id"/>
    <dice-button />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import CursorButton from '@/components/games/show/leftMenu/buttons/CursorButton'
  import DrawingButton from '@/components/games/show/leftMenu/buttons/DrawingButton'
  import LayerButton from '@/components/games/show/leftMenu/buttons/LayerButton'
  import DiceButton from '@/components/games/show/leftMenu/buttons/DiceButton'

  export default {
    name: 'LeftMenu',

    components: { DiceButton, LayerButton, DrawingButton, CursorButton },

    computed: {
      ...mapState({
        master: state => state.game.info.master,
        user: state => state.auth.user,
      }),
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .left-menu-actions {
    position: absolute;
    z-index: 2;
    left: 10px;
    top: 70px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
  }
</style>
