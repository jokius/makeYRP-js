<template>
  <div>
    <v-btn
      class="button-damage"
      raised
      color="black"
      dark
      @click="modalOpen = true"
    >
      Нанести урон
    </v-btn>

    <roll-damage-modal v-if="modalOpen" v-model="obj" :damage="damage" />
  </div>
</template>

<script>
  import RollDamageModal from '../modals/RollDamageModal'

  export default {
    name: 'DamageButton',
    components: { RollDamageModal },
    props: {
      as: { type: Object, required: true },
      damage: { type: Number, required: true },
    },

    data() {
      return {
        modalOpen: false,
      }
    },

    computed: {
      obj: {
        get() {
          return { open: this.modalOpen, dices: 1 }
        },

        set({ open, dices, isClose }) {
          if (!isClose) this.rollDamage(parseInt(dices))
          this.modalOpen = open
        },
      },
    },

    methods: {
      rollDamage(dices) {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'add',
          data: {
            type: 'message',
            body: {
              as: this.as,
              name: 'Урон',
              dices: { d6: dices },
              damage: true,
            },
          },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .button {
    border: none;
    width: 200px;
    min-height: 260px;
  }

  .image {
    width: 100%;
    max-height: 260px;
  }
</style>
