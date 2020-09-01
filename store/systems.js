import { handling } from '@/lib/errorsHandling'
import { addSystem, loadSystems } from '@/api/systems'
import { SystemModel } from '@/models/SystemModel'

export const actions = {
  async load({ commit }, axios) {
    try {
      commit('updateSystems', await loadSystems(axios))
    } catch (error) {
      handling(error)
    }
  },

  async create({ commit }, params) {
    try {
      await addSystem(params)
    } catch (error) {
      handling(commit, error)
    }
  }
}

export const mutations = {
  updateSystems(state, systems) {
    state.list = systems.data.map(data => new SystemModel().setInfo(data))
    state.loaded = true
  },
}
