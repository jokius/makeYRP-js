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

  import DiceButton from './leftMenuButtons/DiceButton'
  import LayerButton from './leftMenuButtons/LayerButton'
  import CursorButton from './leftMenuButtons/CursorButton'
  import DrawingButton from './leftMenuButtons/DrawingButton'

  export default {
    name: 'LeftMenu',
    components: { DrawingButton, CursorButton, LayerButton, DiceButton },

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
