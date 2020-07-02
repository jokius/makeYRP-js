<template>
  <draggable-dialog
    v-model="size"
    :on-close="onClose"
    :title="name"
    :width="size.width"
    :height="size.height"
    resizable
    background-color="#c5c5c5"
  >
    <template v-slot:body>
      <div class="edit-planet-grid" :style="style">
        <div class="equipment-level">Уровень: {{ level }}</div>
        <div v-if="damage" class="equipment-damage">Модификатор урона: {{ damage }}</div>
        <div v-if="protection" class="equipment-damage">Модификатор защиты: {{ protection }}</div>
        <div class="tags-grid">
          <span class="label tag-label">Теги</span>
          <v-chip-group column>
            <v-chip
              v-for="(tag, tagIndex) in tags"
              :key="`tag-${tagIndex}`"
            >
              {{ tag }}
            </v-chip>
          </v-chip-group>
        </div>

        <textarea disabled class="description" :value="description" />
      </div>
    </template>
    <template v-slot:actions>
      <div class="actions-grid">
        <v-btn
          dark
          color="indigo"
          @click="onClose"
        >
          Закрыть
        </v-btn>

        <v-select
          v-model="sheet"
          :items="sheetList"
          class="select-input"
          color="indigo"
        />

        <v-btn
          dark
          color="indigo"
          :disabled="sheetList.length === 0"
          @click="add"
        >
          Добавить
        </v-btn>
      </div>
    </template>
  </draggable-dialog>
</template>

<script>
  import { mapState } from 'vuex'

  import DraggableDialog from '../../../../games/show/DraggableDialog'

  export default {
    name: 'EouItemModal',
    components: { DraggableDialog },

    props: {
      item: { type: Object, required: true },
      uniqKey: { type: Number, required: true },
    },

    data() {
      return {
        sheetList: [],
        id: -1,
        privateSheet: {},
        minWidth: '516px',
        privateWidth: 616,
        privateHeight: 450,
        editorOffsetH: 217,
        bodyOffsetH: 177,
      }
    },

    computed: {
      ...mapState({
        sheets: state => state.game.sheets,
      }),

      size: {
        get() {
          return { width: this.privateWidth, height: this.privateHeight }
        },

        set({ width, height }) {
          this.privateWidth = width
          this.privateHeight = height
        },
      },

      style: {
        get() {
          return { height: `calc(${this.size.height}px - 115px)` }
        },
      },

      sheet: {
        get() {
          return this.id
        },

        set(id) {
          this.privateSheet = this.sheets.find(sheet => sheet.id === id)
          this.id = id
        }
      },

      equipment: {
        get() {
          return this.privateSheet.params.equipment
        },
      },

      name: {
        get() {
          return this.item.name
        }
      },

      level: {
        get() {
          return this.item.level
        }
      },

      damage: {
        get() {
          return this.item.damage
        }
      },

      protection: {
        get() {
          return this.item.protection
        }
      },

      tags: {
        get() {
          return this.item.tags
        }
      },

      description: {
        get() {
          return this.item.description
        }
      },
    },

    created() {
      this.sheetList = this.sheets
        .filter(sheet => sheet.sheetType === 'character' && sheet.acl.canWrite)
        .map(sheet => ({ value: sheet.id, text: sheet.name }))

      if (this.sheetList.length > 0) this.sheet = this.sheetList[0].value
    },

    methods: {
      onClose() {
        this.$store.commit('game/removeOpenModal', this.uniqKey)
      },

      add() {
        this.$store.commit('game/updateSheetParams',
          {
            id: this.id,
            path: `equipment[${this.equipment.length}]`,
            value: this.item,
          })

        this.saveSheet()
        this.onClose()
      },

      saveSheet() {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'change',
          data: { ...this.privateSheet, type: 'sheet' },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .edit-planet-grid {
    overflow: auto;
    padding-left: 2px;
    padding-right: 5px;
  }

  .tags-grid {
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-column-gap: 10px;
    line-height: 35px;
  }

  .input {
    padding: 0;
    margin: 0;
  }

  .tag-label {
    margin-top: 5px;
  }

  .actions-grid {
    display: contents;
  }

  .select-input {
    margin-left: 15px;
    margin-right: 15px;
  }

  .description {
    color: $black;
    resize: none;
    width: 100%;
    height: 70%;
  }
</style>
