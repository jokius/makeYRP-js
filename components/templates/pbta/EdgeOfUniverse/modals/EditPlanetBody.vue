<template>
  <div class="edit-planet-grid" :style="style">
    <div class="name-grid">
      <v-text-field
        v-model="name"
        color="indigo"
        class="input name"
        flat
      />
      <v-btn
        class="button-random"
        raised
        color="black"
        dark
        @click="randomName"
      >
        Случайное
      </v-btn>
    </div>
    <div class="ucgs">
      <div
        v-for="(ucg, index) in ucgs"
        :key="`ucg-${index}`"
        class="ucg-grid"
      >
        <v-text-field
          :value="ucg.name"
          color="indigo"
          class="input"
          label="название"
          flat
          @input="value => inputUcg(index, 'name', value)"
        />
        <v-btn
          class="button-random"
          color="red darken-4"
          dark
          text
          @click="deleteUcg"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-text-field
          :value="ucg.value"
          color="indigo"
          class="input"
          label="значение"
          flat
          @input="inputUcg(index, 'value', value)"
        />
        <v-btn
          class="button-random"
          raised
          color="black"
          dark
          @click="randomUcg(index)"
        >
          Случайное
        </v-btn>
      </div>
      <v-btn
        class="button-random"
        raised
        color="black"
        dark
        @click="addUcg"
      >
        Добавить УГУ
      </v-btn>
    </div>
    <h2 class="planet-title">Особенности</h2>
    <div class="planet-grid">
      <div class="name">{{ planetFeature.name }}</div>
      <v-btn
        class="button-random"
        raised
        color="black"
        dark
        @click="randomPlanetFeature"
      >
        Случайное
      </v-btn>
      <div class="description">{{ planetFeature.description }}</div>
    </div>
    <h2 class="planet-title">Атмосфера</h2>
    <div class="planet-grid">
      <div class="name">{{ atmosphere.name }}</div>
      <v-btn
        class="button-random"
        raised
        color="black"
        dark
        @click="randomAtmosphere"
      >
        Случайное
      </v-btn>
      <div class="description">{{ atmosphere.description }}</div>
    </div>
    <h2 class="planet-title">Колонизация</h2>
    <div class="planet-grid">
      <div class="name">{{ colonization.name }}</div>
      <v-btn
        class="button-random"
        raised
        color="black"
        dark
        @click="randomColonization"
      >
        Случайное
      </v-btn>
      <div class="description">{{ colonization.description }}</div>
    </div>
    <h2 class="planet-title">Регион</h2>
    <div class="planet-grid">
      <div class="name">{{ region.name }}</div>
      <v-btn
        class="button-random"
        raised
        color="black"
        dark
        @click="randomColonization"
      >
        Случайное
      </v-btn>
      <div class="description">{{ region.description }}</div>
    </div>
    <h2 class="planet-title">Специализация</h2>
    <div class="planet-grid">
      <div class="name">{{ specialization.name }}</div>
      <v-btn
        class="button-random"
        raised
        color="black"
        dark
        @click="randomSpecialization"
      >
        Случайное
      </v-btn>
      <div class="description">{{ specialization.description }}</div>
    </div>
    <h2 class="planet-title">Статистические свойства</h2>
    <div class="planet-grid">
      <div class="name">{{ colonizationFeature.name }}</div>
      <v-btn
        class="button-random"
        raised
        color="black"
        dark
        @click="randomSpecialization"
      >
        Случайное
      </v-btn>
      <div class="description">{{ colonizationFeature.description }}</div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { d6roll } from '~/lib/rollDices'

  export default {
    name: 'EditPlanetBody',

    props: {
      planet: { type: Object, required: true },
      size: { type: Object, required: true },
      isNew: { type: Boolean, required: true },
    },

    computed: {
      ...mapState({
        tables: state => state.game.info.template.tables,
      }),

      style: {
        get() {
          return { height: `calc(${this.size.height}px - 100px)` }
        },
      },

      name: {
        get() {
          return this.planet.params.name
        },

        set(value) {
          this.input('name', value)
        },
      },

      ucgs: {
        get() {
          return this.planet.params.ucgs
        },
      },

      planetFeature: {
        get() {
          return this.planet.params.planetFeature
        },
      },

      atmosphere: {
        get() {
          return this.planet.params.atmosphere
        },
      },

      colonization: {
        get() {
          return this.planet.params.colonization
        },
      },

      region: {
        get() {
          return this.planet.params.region
        },
      },

      specialization: {
        get() {
          return this.planet.params.specialization
        },
      },

      colonizationFeature: {
        get() {
          return this.planet.params.colonizationFeature
        },
      },
    },

    created() {
      if (this.isNew) {
        this.randomName()
        this.randomPlanetFeature()
        this.randomAtmosphere()
        this.randomColonization()
        this.randomRegion()
        this.randomSpecialization()
        this.randomColonizationFeature()
      }
    },

    methods: {
      randomName() {
        const names = this.tables.planetNames
        this.input('name', names[Math.floor(Math.random() * names.length)])
      },

      randomUcg(index) {
        this.inputUcg(index, 'value', this.tables.ucg[d6roll()].name)
      },

      inputUcg(index, path, value) {
        const list = this.ucgs.slice()
        list[0][path] = value
        this.input('ucgs', list)
      },

      randomPlanetFeature() {
        this.input('planetFeature', this.tables.planetFeatures[d6roll()])
      },

      randomAtmosphere() {
        this.input('atmosphere', this.tables.atmosphere[d6roll()])
      },

      randomColonization() {
        this.input('colonization', this.tables.colonization[d6roll()])
      },

      randomRegion() {
        this.input('region', this.tables.region[d6roll()])
      },

      randomSpecialization() {
        this.input('specialization', this.tables.specialization[`${d6roll()}${d6roll()}`])
      },

      randomColonizationFeature() {
        this.input('colonizationFeature', this.tables.colonizationFeatures[`${d6roll()}${d6roll()}`])
      },

      input(path, value) {
        if (this.isNew) {
          // eslint-disable-next-line vue/no-mutating-props
          this.planet.params[path] = value
        } else {
          this.$store.commit('game/updateMenuItemParams', {
            id: this.planet.id,
            menuId: this.planet.menuId,
            path,
            value,
          })
        }
      },

      addUcg() {
        const usg = { name: '', value: '' }
        this.input('ucgs', [...this.ucgs, usg])
      },

      deleteUcg() {

      },
    },
  }
</script>

<style scoped lang="scss">
  .edit-planet-grid {
    overflow: auto;
    padding-left: 2px;
    padding-right: 5px;
  }

  .name-grid {
    display: grid;
    grid-template-columns: 270px max-content;
    justify-content: space-between;
    .button-random {
      margin-top: 14px;
    }
  }

  .ucg-grid {
    display: grid;
    grid-template-columns: 270px max-content;
    justify-content: space-between;
    .button-random {
      margin-top: 14px;
    }
  }

  .planet-title {
    text-align: center;
    font-size: 20px;
  }

  .planet-grid {
    display: grid;
    grid-template-columns: 1fr max-content;
  }

  .name {
    line-height: 36px;
    font-size: 17px;
  }

  .description {
    margin-top: 10px;
    margin-bottom: 10px;
    grid-column-start: 1;
    grid-column-end: 3;
  }
</style>
