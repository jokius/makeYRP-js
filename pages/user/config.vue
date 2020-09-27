<template>
  <v-app id="inspire">
    <change-form />
  </v-app>
</template>

<script>

import ChangeForm from '~/components/user/ChangeForm'

export default {
  name: 'UserConfig',

  components: { ChangeForm },

  data() {
    return {
      tab: null,
    }
  },
}
</script>
