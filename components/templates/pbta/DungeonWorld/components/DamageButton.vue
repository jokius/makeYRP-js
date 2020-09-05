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

    <roll-damage-modal v-if="modalOpen" v-model="obj" />
  </div>
</template>

<script>
  import RollDamageModal from '../modals/RollDamageModal'

  export default {
    name: 'DamageButton',
    components: { RollDamageModal },
    props: {
      sheet: { type: Object, required: true },
      damage: { type: String, required: true },
      damageMod: { type: Number, required: true },
    },

    data() {
      return {
        modalOpen: false,
      }
    },

    computed: {
      obj: {
        get() {
          return { open: this.modalOpen, modifier: this.damageMod }
        },

        set({ open, modifier, isClose }) {
          if (!isClose) this.rollDamage(parseInt(modifier))
          this.modalOpen = open
        },
      },
    },

    methods: {
      rollDamage(modifier) {
        let dicesString
        if (modifier > 0) {
          dicesString = `${this.damage}+${modifier}`
        } else if (modifier < 0) {
          dicesString = `${this.damage}${modifier}`
        } else {
          dicesString = this.damage
        }

        this.$cable.perform({
          channel: 'GameChannel',
          action: 'add',
          data: {
            type: 'message',
            body: {
              sheet: this.sheet,
              name: 'Урон',
              dices_string: dicesString,
              isDamage: true,
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
