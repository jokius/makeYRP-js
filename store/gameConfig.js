import { handling } from '../lib/errorsHandling'
import { GameModel } from '../models/GameModel'
import { cloneDeep, get, set } from 'lodash'
import { loadGame, updateGame } from '../api/gameConfig'

export const state = () => ({
  info: null,
  loaded: false,
})

export const actions = {
  async load({ commit }, { axios, id }) {
    try {
      commit('gameLoaded', await loadGame({ axios, id }))
      commit('setLoaded')
    } catch (error) {
      handling(error)
    }
  },

  async update({ commit }, params) {
    try {
      await updateGame(params)
    } catch (error) {
      handling(commit, error)
    }
  },
}

export const mutations = {
  gameLoaded(state, game) {
    state.info = new GameModel().setInfo(game)
  },

  setLoaded(state) {
    state.loaded = true
  },

  update(state, { path, value, remove = false }) {
    const game = cloneDeep(state.info)
    let mutVal = value
    if (remove) {
      mutVal = get(game, path, []).slice()
      mutVal.splice(value, 1)
    }

    set(game, path, mutVal)
    state.info = game
  },
}
