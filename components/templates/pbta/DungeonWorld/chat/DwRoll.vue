<template>
  <show-description v-if="body.showDescription" :body="body" />
  <auto-full v-else-if="body.autoFull" :body="body" />
  <auto-part v-else-if="body.autoPart" :body="body" />
  <damage-roll v-else-if="body.isDamage" :body="body" />
  <dice-roll v-else :body="body" />
</template>

<script>
  import AutoFull from './AutoFull'
  import AutoPart from './AutoPart'
  import DiceRoll from './DiceRoll'
  import DamageRoll from './DamageRoll'
  import ShowDescription from './ShowDescription'

  export default {
    name: 'DwRoll',

    components: { ShowDescription, DamageRoll, DiceRoll, AutoPart, AutoFull },

    props: {
      body: { type: Object, required: true },
    },
  }
</script>
