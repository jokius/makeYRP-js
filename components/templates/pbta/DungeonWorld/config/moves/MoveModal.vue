<template>
  <v-dialog :value="obj.open" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или Изменить ход
      </v-card-title>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-text-field
              v-model="name"
              label="название"
              color="indigo"
            />

            <div>Описание</div>
            <wysiwyg v-model="description" />

            <v-select
              v-model="type"
              :items="stats"
              chips
              label="Характеристика для проверки"
              multiple
            />

            <div>Результат 10+</div>
            <wysiwyg v-model="full" />

            <div>Результат 7-9</div>
            <wysiwyg v-model="part" />

            <div>Результат 6-</div>
            <wysiwyg v-model="fail" />

            <div>Результат Дополнительно</div>
            <wysiwyg v-model="details" />

            <v-checkbox
              v-model="damageButton"
              label="Кнопка урона"
            />
            <div v-for="(select, index) in selects" :key="`select-${index}`">
              <v-text-field
                label="название группы"
                color="indigo"
                :value="select.label"
                @input="value => changeLabel(index, value)"
              />

              <v-checkbox
                :input-value="select.multiple"
                @change="value => changeMultiple(index, value)"
                label="множоственный выбор"
              />
              <div v-for="(item, itemIndex) in select.items" :key="`select-item-${index}-${itemIndex}`">
                <div class="move-select-item-grid">
                  <v-text-field
                    class="move-select-item-name"
                    label="название"
                    color="indigo"
                    :value="item.text"
                    @input="value => changeText(index, itemIndex, value)"
                  />
                  <v-text-field
                    class="move-select-item-description"
                    label="описание"
                    color="indigo"
                    :value="item.description"
                    @input="value => changeDescription(index, itemIndex, value)"
                  />
                  <v-btn
                    class="move-select-item-remove"
                    color="red darken-4"
                    small
                    dark
                    @click="removeItem(index, itemIndex)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>

              <v-btn
                class="button"
                color="indigo"
                @click="addItem(index)"
                dark
              >
                <span>Добавить элемент</span>
              </v-btn>
            </div>

            <v-btn
              class="button"
              color="indigo"
              @click="addSelect"
              dark
            >
              <span>Добавить выбор</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-divider />

      <v-card-actions>
        <v-btn
          dark
          color="indigo"
          @click="close"
        >
          Закрыть
        </v-btn>

        <v-spacer />

        <v-btn
          :disabled="!isValid"
          color="indigo"
          @click="change"
        >
          <span :class="{ 'white--text': isValid }">Сохранить</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex'
  import { omitBy } from 'lodash'

  export default {
    name: 'MoveModal',

    model: {
      prop: 'obj',
      event: 'changeMove',
    },

    props: {
      obj: { type: Object, required: true },
    },

    computed: {
      ...mapState({
        game: state => state.gameConfig.info,
      }),


      isValid() {
        return (this.name && this.name !== '' && this.description && this.description !== '')
      },

      move() {
        return this.obj.move
      },

      name: {
        get() {
          return this.move.name
        },

        set(value) {
          this.input('name', value)
        },
      },

      description: {
        get() {
          return this.move.description
        },

        set(value) {
          this.input('description', value)
        },
      },

      statesList() {
        return this.game.template.sheets.character.stats
      },

      stats() {
        return this.statesList.map((item, index) => ({
            value: index,
            text: item.short
          }))
      },

      type: {
        get() {
          if (!this.move.type) return []

          if (typeof this.move.type === 'string') {
            const index = this.statesList.findIndex(item => item.type === this.move.type)
            return [index]
          }
          else {
            return this.move.type.map(stat => this.statesList.findIndex(item => item.type === stat.value))
          }
        },

        set(indexes) {
          if (indexes.length > 1) {
            this.input('type', this.typesByIndexes(indexes))
          } else if (indexes.length === 1) {
            this.input('type', this.typesByIndexes(indexes)[0].value)
          } else {
            this.input('type', null)
          }
        },
      },

      full: {
        get() {
          return this.move.full
        },

        set(value) {
          this.input('full', value)
        },
      },

      part: {
        get() {
          return this.move.part
        },

        set(value) {
          this.input('part', value)
        },
      },

      fail: {
        get() {
          return this.move.fail
        },

        set(value) {
          this.input('fail', value)
        },
      },

      details: {
        get() {
          return this.move.details
        },

        set(value) {
          this.input('details', value)
        },
      },

      damageButton: {
        get() {
          return this.move.damageButton
        },

        set(value) {
          this.input('damageButton', value)
        },
      },

      selects() {
        return this.move.selects || []
      }
    },

    methods: {
      addSelect() {
        const list = JSON.parse(JSON.stringify(this.selects))
        list.push({ label: '', items: [], multiple: false })
        this.input('selects', list)
      },

      changeLabel(index, value) {
        const list = JSON.parse(JSON.stringify(this.selects))
        list[index].label = value
        this.input('selects', list)
      },

      changeMultiple(index, value) {
        const list = JSON.parse(JSON.stringify(this.selects))
        list[index] = { ...list[index], multiple: value }
        this.input('selects', list)
      },

      addItem(index) {
        const list = JSON.parse(JSON.stringify(this.selects))
        list[index].items = list[index].items || []
        list[index].items.push({ text: '', description: '', value: list[index].items.length })
        this.input('selects', list)
      },

      changeText(index, itemIndex, value) {
        const list = JSON.parse(JSON.stringify(this.selects))
        const item = list[index].items[itemIndex]
        list[index].items[itemIndex] = { ...item, text: value }

        this.input('selects', list)
      },

      changeDescription(index, itemIndex, value) {
        const list = JSON.parse(JSON.stringify(this.selects))
        const item = list[index].items[itemIndex]
        list[index].items[itemIndex] = { ...item, description: value }

        this.input('selects', list)
      },

      removeItem(index, itemIndex) {
        const list = JSON.parse(JSON.stringify(this.selects))
        const items = JSON.parse(JSON.stringify(this.selects[index].items))
        items.splice(itemIndex, 1)
        list[index].items = items
        this.input('selects', list)
      },

      typesByIndexes(indexes) {
        return indexes.map(index => {
          const item = this.statesList[index]
          return { text: item.short, value: item.type }
        })
      },

      input(key, value) {
        this.$set(this.move, key, value)
      },

      change() {
        if (this.isValid) {
          this.$emit('changeMove', {
            open: false,
            move: omitBy(this.move, value => typeof value === 'undefined' || value === null || value === '')
          })
        }
      },

      close() {
        this.$emit('changeMove', { open: false, isClose: true })
      },
    },
  }
</script>

<style scoped lang="scss">
.button {
  margin-bottom: 5px;
}

.move-select-item-grid {
  display: grid;
  grid-column-gap: 5px;
  grid-template-columns: 1fr max-content;
  grid-template-areas:
  'name remove'
  'description remove';
}

.move-select-item-name {
  grid-area: name;
}

.move-select-item-description {
  grid-area: description;
}

.move-select-item-remove {
  grid-area: remove;
  position: relative;
  top: 50%;
}
</style>
