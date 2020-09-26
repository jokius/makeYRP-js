<template>
  <div class="grid-message">
    <p class="dices">бросок {{ rollText }}</p>
    <div v-for="(rolls, dice) in dices" :key="`${dice}-${Date.now}`">
      <div v-for="(value, index) in rolls" :key="`${dice}-${index}-${Date.now}`" class="dice">
        <span :class=diceClass(dice)>{{ valueToSymb(dice, value) }}</span>
        <span v-if="index + 1 < rolls.length" class="plus"> + </span>
        <span v-if="incr !== 0 && index + 1 === rolls.length" class="plus"> {{ incrMessage }} </span>
      </div>
    </div>
    <p class="dices-sum"> = {{ sum }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DefaultRoll',

  props: {
    roll: { type: Object, required: true },
  },

  data() {
    const { dice, mod, incr, result } = this.roll
    return {
      dice,
      mod,
      incr,
      result,
    }
  },

  computed: {
    ...mapState({
      system: state => state.game.info.system,
    }),

    dices() {
      return this.dice || this.roll
    },

    rollText() {
      if (this.dice) return this.messageByString()
      else return this.messageByKey()
    },

    modMessage() {
      return this.mod === 'h' ? 'Большее значение: ' : 'Меньшее значение: '
    },

    incrMessage() {
      return this.incr > 0 ? `+${this.incr}` : this.incr
    },

    sum() {
      if (this.result) return this.result

      let message = 0
      for (const key in this.roll) {
        message = this.roll[key].reduce((accumulator, dice) =>
            (accumulator + dice),
          message)
      }

      return message
    },
  },

  methods: {
    messageByString() {
      let message = ''
      if (this.mod) message += this.modMessage
      const dices = []
      for (const key in this.dice) {
        dices.push(`${this.dice[key].length}${key}`)
      }

      message += dices.join(' + ')
      if (this.incr && this.incr !== 0) message += this.incrMessage

      return message
    },

    messageByKey() {
      const message = []
      for (const key in this.roll) {
        message.push(`${this.roll[key].length}${key}`)
      }

      return message.join(' + ')
    },

    valueToSymb(dice, value) {
      if (!['d8', 'd10', 'd12', 'd20'].includes(dice)) return value

      let result = value.toString()

      if (dice === 'd10') {
        return result
          .replace('0', 'a')
          .replace('1', 'b')
          .replace('2', 'c')
          .replace('3', 'd')
          .replace('4', 'e')
          .replace('5', 'f')
          .replace('6', 'g')
          .replace('7', 'h')
          .replace('8', 'i')
          .replace('9', 'j')
      }

      if (dice === 'd100') {
        return result.split('').map(value => this.replaceNumberToChar(value)).join('')
      }

      if (['d12', 'd20'].includes(dice)) {
        result = result
          .replace('10', 'j')
          .replace('11', 'k')
          .replace('12', 'l')
          .replace('13', 'm')
          .replace('14', 'n')
          .replace('15', 'o')
          .replace('16', 'p')
          .replace('17', 'q')
          .replace('18', 'r')
          .replace('19', 's')
          .replace('20', 'T')
      }

      return result
        .replace('1', 'a')
        .replace('2', 'b')
        .replace('3', 'c')
        .replace('4', 'd')
        .replace('5', 'e')
        .replace('6', 'f')
        .replace('7', 'g')
        .replace('8', 'h')
        .replace('9', 'i')
    },

    replaceNumberToChar(value) {
      return value
        .replace('0', 'a')
        .replace('1', 'b')
        .replace('2', 'c')
        .replace('3', 'd')
        .replace('4', 'e')
        .replace('5', 'f')
        .replace('6', 'g')
        .replace('7', 'h')
        .replace('8', 'i')
        .replace('9', 'j')
    },

    diceClass(dice) {
      const diceReplace = dice.replace('d', 'dice')
      if ( !['dice8', 'dice10', 'dice12', 'dice20'].includes(diceReplace)) return 'custom-dice'

      if (diceReplace === 'dice100') {
        return 'dice10'
      } else {
        return diceReplace
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import '~assets/css/colors';

$border: 3px solid $black;
$size: 60px;

.grid-message {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto;
  grid-row-gap: 5px;
}

.dice {
  display: inline-flex;
}

.plus {
  font-size: 30px;
  position: relative;
  top: 14px;
  margin-left: 2px;
  margin-right: 2px;
}

.custom-dice {
  border-radius: 5px;
  min-width: 38px;
  height: 38px;
  overflow: hidden;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
  padding-right: 4px;
  font-weight: bold;
  font-size: 21px;
  padding-left: 4px;
}

.dice4 {
  font-size: 50px;
}

.dice6 {
  font-size: 50px;
}

.dice8 {
  font-size: 50px;
}

.dice10 {
  font-size: 50px;
}

.dice12 {
  font-size: 50px;
}

.dice20 {
  font-size: 50px;
}

.dice100 {
  font-size: 50px;
}

</style>
