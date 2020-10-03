<template>
  <draggable-dialog
    :on-close="onClose"
    title="Название папки"
    :width="300"
    :height="200"
    :size="{}"
    name="rename-item-folder"
  >
    <template v-slot:body>
      <v-container class="fill-height page-modal-body" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-text-field
              v-model="name"
              required
              color="indigo"
              autofocus
              @focus="$event.target.select()"
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template v-slot:actions>
      <v-btn
        dark
        color="indigo"
        @click="onClose"
      >
        Закрыть
      </v-btn>
      <v-spacer />
      <v-btn
        :disabled="!isValid"
        color="indigo"
        @click="save"
      >
        <span :class="{ whiteText: isValid }">{{ isNew ? 'Создать' : 'Изменить' }}</span>
      </v-btn>
    </template>
  </draggable-dialog>
</template>

<script>
  import DraggableDialog from '../DraggableDialog'

  export default {
    name: 'RenameItemFolder',

    components: { DraggableDialog },

    props: {
      uniqKey: { type: Number, required: true },
      id: { type: String },
      parentId: { type: String },
      isNew: { type: Boolean, required: true },
      oldName: { type: String, required: true }
    },

    data() {
      return {
        privateName: this.oldName
      }
    },

    computed: {
      isValid() {
        return this.name && this.name !== ''
      },

      name: {
        get() {
          return this.privateName
        },
        set(value) {
          this.privateName = value
        },
      },
    },


    methods: {
      onClose() {
        this.$store.commit('game/removeOpenModal', this.uniqKey)
        this.name = this.oldName
      },

      save() {
        this.$store.commit('game/removeOpenModal', this.uniqKey)

        this.$cable.perform({
          channel: 'GameChannel',
          action: this.isNew ? 'add' : 'change',
          data: {
            id: this.id,
            parent_id: this.parentId,
            name: this.name,
            type: 'item_folder',
          },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .whiteText {
    color: $white;
  }

  .page-modal-body {
    height: 100px;
  }
</style>
