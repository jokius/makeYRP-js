<template>
  <v-dialog :value="obj.open" max-width="300" persistent>
    <v-card>
      <v-toolbar height="40" dark color="indigo" class="draggable-dialog-header drag-handle">
        <v-toolbar-title>Выбор персонажа</v-toolbar-title>
        <v-spacer />
        <v-btn icon dark @click="onClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="list">
        <div v-for="sheet in sheets" :key="sheet.id" class="list-item pointer" @click="select(sheet)">
          <v-avatar color="indigo" size="32" tile>
            <v-img :src="sheet.imgChat" :alt="sheet.name" />
          </v-avatar>
          <div class="sheet-name">
            {{ sheet.name }}
          </div>
        </div>

        <div class="list-item pointer" @click="select({})">
          <v-spacer class="empty-avatar" />
          <div class="sheet-name">
            Сбросить
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'SelectSheetModal',

    model: {
      prop: 'obj',
      event: 'selectSheet',
    },

    props: {
      obj: { type: Object, required: true },
    },

    computed: {
      ...mapState({
        sheets: state => state.game.sheets.filter(sheet => sheet.acl.canWrite),
      }),
    },

    methods: {
      select(sheet) {
        this.$emit('selectSheet', { open: false, sheet })
      },

      onClose() {
        this.$emit('selectSheet', { open: false, isClose: true })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .pointer {
    cursor: pointer;
  }

  .list {
    display: grid;
    grid-row-gap: 2px;
    margin-top: 5px;
  }

  .list-item {
    display: grid;
    grid-template-columns: max-content 1fr;
    background-color: $grayEE;
  }

  .sheet-name {
    font-size: 16px;
    text-align: center;
    line-height: 32px;
    min-height: 32px;
    width: 100%;
  }

  .empty-avatar {
    width: 32px;
    height: 32px;
  }
</style>
