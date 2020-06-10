<template>
  <div class="edit-planet-grid" :style="style">
    <div class="ucgs">
      <div v-for="(ucg, index) in ucgs" :key="`ucg-${index}`">
        {{ ucg.name }}: {{ ucg.value }}
      </div>
    </div>
    <h2 class="planet-title">Особенности</h2>
    <div class="name">{{ planetFeature.name }}</div>
    <div class="description">{{ planetFeature.description }}</div>

    <h2 class="planet-title">Атмосфера</h2>
    <div class="name">{{ atmosphere.name }}</div>
    <div class="description">{{ atmosphere.description }}</div>

    <h2 class="planet-title">Колонизация</h2>
    <div class="name">{{ colonization.name }}</div>
    <div class="description">{{ colonization.description }}</div>

    <h2 class="planet-title">Регион</h2>
    <div class="name">{{ region.name }}</div>
    <div class="description">{{ region.description }}</div>

    <h2 class="planet-title">Специализация</h2>
    <div class="name">{{ specialization.name }}</div>
    <div class="description">{{ specialization.description }}</div>

    <h2 class="planet-title">Статистические свойства</h2>
    <div class="name">{{ colonizationFeature.name }}</div>
    <div class="description">{{ colonizationFeature.description }}</div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'ViewPlanetBody',

    props: {
      planet: { type: Object, required: true },
      size: { type: Object, required: true },
    },

    computed: {
      ...mapState({
        tables: state => state.game.info.template.tables,
      }),

      style: {
        get() {
          return { height: `${this.size.height - 40}px` }
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
